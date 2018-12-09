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
class Connection {
    constructor(socket, events, codes, modules) {
        this.socket = socket;
        this.events = events;
        this.codes = codes;
        this.modules = modules;
        this.data = { wsid: 0 };
        this.init();
    }
    get wsid() { return this.get('wsid', 0); }
    get ip() { return this.socket.remoteAddress; }
    init() {
        this.onRise();
        this.socket.on('error', (err) => this.onError(err));
        this.socket.on('close', (code, reason) => this.onClose(code, reason));
        this.socket.on('message', ((message) => this.onMessage(message)));
        return this;
    }
    onRise() {
        this.events.emit('connection.rise', this);
        this.ok('codes', this.codes, -1);
        return this;
    }
    onDrop() {
        this.events.emit('connection.drop', this);
        let auth = this.get('auth');
        if (auth) {
            auth.disconnect();
            this.events.emit('auth.disconnect', auth);
        }
        return this;
    }
    onClose(code, reason) {
        this.onDrop();
        return this;
    }
    onError(error) {
        this.onDrop();
        return this;
    }
    onPing() {
        this.set('lastPing', new Date());
        return this.pong();
    }
    onMessage(message) {
        this.set('lastMessage', new Date());
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
    onParsed(message) {
        if (message.id) {
            this.set('wsid', message.id);
        }
        if (!message.target) {
            return this.bad('bad target');
        }
        let mod = this.modules.find(m => m.constructor.name.toLowerCase() == message.target.toLowerCase() + 'module');
        if (mod) {
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
        else {
            return this.bad('bad target');
        }
    }
    get(name, def) { if (!this.data) {
        this.data = {};
    } return this.data[name] == undefined ? def : this.data[name]; }
    set(name, value, overwrite = true) {
        if (!this.data) {
            this.data = {};
        }
        if (overwrite || this.data[name] == undefined) {
            this.data[name] = value;
        }
        return this;
    }
    send(message, json = true, binary = false) {
        this.socket[binary ? 'sendBytes' : 'sendUTF'](json ? JSON.stringify(message) : message);
        return this;
    }
    pong() { return this.send('pong', false, false); }
    badResponse(code = 1, message = '', id = this.wsid) { return this.send(new ConnectionResponse(id, code, message, this.codes)); }
    bad(code = 'unknown', message = '', id = this.wsid) { return this.badResponse(this.getCode(code), message, id); }
    okResponse(cls, data, id = this.wsid) { return this.send(new ConnectionResponse(id, this.getCode('success'), { class: cls, data }, this.codes)); }
    ok(cls, data, id = this.wsid) { return this.okResponse(cls, cls == 'code' ? this.getCode(data) : data, id); }
    broadcast(cls, data, filter) {
        this.events.emit('server.broadcast', { type: 'connection', class: cls, data, filter });
        return this;
    }
    file(cls, path, id = this.wsid, json = true) {
        try {
            let f = FS.readFileSync(path).toString();
            return this.ok(cls, json ? JSON.parse(f) : f, id);
        }
        catch (e) {
            return this.bad('not found', id);
        }
    }
    getCode(code = 'unknows') { return Connection.getCode(this.codes, code); }
    static getCode(codes, code = 'unknown') {
        if (typeof code == 'string') {
            return codes.findIndex(c => c == code.toUpperCase().replace(/ /g, '_'));
        }
        else if (typeof code == 'number' && code_component_1.Codes[code]) {
            return code;
        }
        return this.getCode(codes);
    }
    static HttpBad(res, status, code, codes) { return res.status(status).send(new ConnectionResponse(0, Connection.getCode(codes, code), '', codes)); }
    static HttpOk(res, cls, data, codes) { return res.send(new ConnectionResponse(0, Connection.getCode(codes, 'success'), { class: cls, data }, codes)); }
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
