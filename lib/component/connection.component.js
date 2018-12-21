"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const FS = __importStar(require("fs"));
const code_component_1 = require("./code.component");
const controller_1 = require("../controller");
const events_1 = require("../events");
/** A Connection wrapper for ws.connection */
class Connection {
    constructor(socket, events, codes, modules, interceptors) {
        this.socket = socket;
        this.events = events;
        this.codes = codes;
        this.modules = modules;
        this.interceptors = interceptors;
        this.data = { wsid: 0 };
        this.init();
    }
    /** Retrive current ws.message id */
    get wsid() { return this.get('wsid', 0); }
    /** Try to retrive ip of ws.connection */
    get ip() { return this.socket.remoteAddress; }
    /** Initialize callbacks for the socket */
    init() {
        this.onRise();
        this.socket.on('error', (err) => this.onError(err));
        this.socket.on('close', (code, reason) => this.onClose(code, reason));
        this.socket.on('message', ((message) => this.onMessage(message)));
        return this;
    }
    /** Event of initializing */
    onRise() {
        this.events.emit(events_1.Event.Connection.Rise.Name, this);
        this.interceptors.intercept(events_1.Event.Connection.Rise.Name, [], { type: 'string', callback: (int) => { this.bad('', int); } }, { type: 'any', callback: () => { this.ok('codes', this.codes, -1); } });
        return this;
    }
    /** Event of dropping connection (fired when closed in any way - accidentally or not) */
    onDrop() {
        this.events.emit(events_1.Event.Connection.Drop.Name, this);
        this.interceptors.intercept(events_1.Event.Connection.Drop.Name, []);
        // TODO: pass it to auth service
        let auth = this.get('auth');
        if (auth) {
            auth.disconnect();
            this.events.emit('auth.disconnect', auth);
        }
        return this;
    }
    /** Event of closing connection (fired when not accidentally closed) */
    onClose(code, reason) {
        this.events.emit(events_1.Event.Connection.Close.Name, this);
        this.interceptors.intercept(events_1.Event.Connection.Close.Name, []);
        this.onDrop();
        return this;
    }
    /** Event of error in connection */
    onError(error) {
        this.events.emit(events_1.Event.Connection.Error.Name, error);
        this.interceptors.intercept(events_1.Event.Connection.Error.Name, []);
        this.onDrop();
        return this;
    }
    /** Event when pinging the socket (ping - pong messages) */
    onPing() {
        this.events.emit(events_1.Event.Connection.Ping.Name, this);
        this.set('lastPing', new Date());
        this.interceptors.intercept(events_1.Event.Connection.Ping.Name, []);
        return this.pong();
    }
    /** Event fired when reciving message (still not parsed) */
    onMessage(message) {
        this.events.emit(events_1.Event.Connection.Message.Name, message);
        this.set('lastMessage', new Date());
        this.interceptors.intercept(events_1.Event.Connection.Message.Name, []);
        if (message.type == 'utf8') {
            if (message.utf8Data == 'ping') {
                this.onPing();
            }
            else {
                let msgdata;
                try {
                    msgdata = JSON.parse(message.utf8Data);
                }
                catch (e) {
                    this.bad('bad format');
                }
                try {
                    this.onParsed(msgdata);
                }
                catch (e) {
                    this.bad('server error', e.stack.split('\n'));
                }
            }
        }
        else if (message.type === 'binary') {
            this.bad('bad format');
        }
        return this;
    }
    /** Event fired when receiving a parsed message */
    onParsed(message) {
        this.events.emit(events_1.Event.Connection.ParsedMessage.Name, message);
        this.interceptors.intercept(events_1.Event.Connection.ParsedMessage.Name, []);
        if (message.id) {
            this.set('wsid', message.id);
        }
        if (!message.target) {
            return this.bad('bad target');
        }
        let mod = this.modules.find(m => m.constructor.name.toLowerCase() == message.target.toLowerCase() + 'module');
        if (mod) {
            this.events.emit(events_1.Event.Connection.Digest.Name, mod);
            this.interceptors.intercept(mod.constructor, [message], { type: 'function', callback: (int) => { int.call(this); } }, { type: 'false', callback: null }, { type: 'null', callback: () => { this.digest(mod, message); } }, { type: 'any', callback: () => { this.digest(mod, message); } });
        }
        else {
            return this.bad('bad target');
        }
    }
    digest(mod, message) {
        let digest = mod.digest(this, message);
        if (!digest) {
            return this.bad('bad section');
        }
        else if (digest == controller_1.Controller.NotDig) {
            return this.bad('bad page');
        }
        else if (digest == controller_1.Controller.BadDig) {
            return this.bad('bad request');
        }
        else if (typeof digest == 'string') {
            return this.bad(digest);
        }
        else if (typeof digest == 'object' && digest.bad) {
            let response = digest;
            return this.bad(response.code, response.message);
        }
        else {
            let response = digest;
            return this.ok(response.class, response.data, response.id);
        }
    }
    /** Get a connection custom data */
    get(name, def) { if (!this.data) {
        this.data = {};
    } return this.data[name] == undefined ? def : this.data[name]; }
    /** Set a connection custom data (default overwrite? = true) */
    set(name, value, overwrite = true) {
        if (!this.data) {
            this.data = {};
        }
        if (overwrite || this.data[name] == undefined) {
            this.data[name] = value;
        }
        return this;
    }
    /** Send simple message (not structured) to the socket */
    send(message, json = true, binary = false) {
        this.events.emit(events_1.Event.Connection.Send.Name, message);
        this.socket[binary ? 'sendBytes' : 'sendUTF'](json ? JSON.stringify(message) : message);
        return this;
    }
    /** Make a pong response to ping request */
    pong() {
        this.events.emit(events_1.Event.Connection.Pong.Name, this);
        return this.send('pong', false, false);
    }
    /** Send a bad (structured) response to the socket by numeric code [pref use 'bad' method] */
    badResponse(code = 1, message = '', id = this.wsid) { return this.send(new ConnectionResponse(id, code, message, this.codes)); }
    /** Send a bad (structured) response to the socket by string codev */
    bad(code = 'unknown', message = '', id = this.wsid) { return this.badResponse(this.getCode(code), message, id); }
    /** Send an ok (structured) response to the socket [pref use 'ok' method] */
    okResponse(cls, data, id = this.wsid) { return this.send(new ConnectionResponse(id, this.getCode('success'), { class: cls, data }, this.codes)); }
    /** Send an ok (structured) response to the socket with autogenerated codes */
    ok(cls, data, id = this.wsid) { return this.okResponse(cls, cls == 'code' ? this.getCode(data) : data, id); }
    /** Send an ok (structured) repsponse to all connections (filtered by filter param callback) */
    broadcast(cls, data, filter) {
        this.events.emit(events_1.Event.Server.Broadcast.Name, { class: cls, data, filter });
        return this;
    }
    /** Send a file trought the socket [experimental] */
    file(cls, path, id = this.wsid, json = true) {
        try {
            let f = FS.readFileSync(path).toString();
            return this.ok(cls, json ? JSON.parse(f) : f, id);
        }
        catch (e) {
            return this.bad('not found', id);
        }
    }
    /** Get the string code from numeric and vice-versa */
    getCode(code = 'unknows') { return Connection.getCode(this.codes, code); }
    /** Get the string code from numeric and vice-versa */
    static getCode(codes, code = 'unknown') {
        if (typeof code == 'string') {
            return codes.findIndex(c => c == code.toUpperCase().replace(/ /g, '_'));
        }
        else if (typeof code == 'number' && code_component_1.Codes[code]) {
            return code;
        }
        return this.getCode(codes);
    }
    /** Send HttpBad Response from an Express Http Response */
    static HttpBad(res, status, code, codes) { return res.status(status).send(new ConnectionResponse(0, Connection.getCode(codes, code), '', codes)); }
    /** Send HttpOk Response from an Express Http Response */
    static HttpOk(res, cls, data, codes) { return res.send(new ConnectionResponse(0, Connection.getCode(codes, 'success'), { class: cls, data }, codes)); }
    /** Send HttpFile Response from an Express Http Response */
    static HttpFile(res, cls, path, codes) {
        if (FS.existsSync(path)) {
            try {
                let f = FS.readFileSync(path).toString();
                res.send(new ConnectionResponse(0, Connection.getCode(codes, 'success'), { class: cls, data: JSON.parse(f) }, codes));
            }
            catch (e) {
                Connection.HttpBad(res, 404, 'not found', codes);
            }
        }
        else {
            Connection.HttpBad(res, 404, 'not found', codes);
        }
    }
}
exports.Connection = Connection;
/** Structured response for WebSocket Rest Server */
class ConnectionResponse {
    constructor(id = 0, code = 0, message = '', codes) {
        this.id = id;
        this.code = code;
        this.message = message;
        this.ok = false;
        this.id = id;
        this.ok = code == 0;
        this.code = code;
        this.statusCode = codes[code];
        this.message = message;
        Object.seal(this);
    }
    set(index, value = null) {
        if (index == 'code') {
            this.code = value;
            this.ok = value == 0;
        }
        else if (index == 'message') {
            this.message = value;
        }
        return this;
    }
}
exports.ConnectionResponse = ConnectionResponse;
