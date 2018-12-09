"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const WS = __importStar(require("websocket"));
const BODYPARSER = __importStar(require("body-parser"));
const HTTP = __importStar(require("http"));
const PATH = __importStar(require("path"));
const component_1 = require("./component");
const component_2 = require("./component");
/** Abstract Class for type inference */
class AbstractTypeClass {
}
exports.AbstractTypeClass = AbstractTypeClass;
/**
 * WRServer - Websocket Rest Server
 *
 * directory - base directory of the server
 *
 * port - serving port
 *
 * modules - array of Modules used in the server
 *
 * wsprotocol - string of the choosen protocol for ws accept
 */
class WRServer {
    constructor(directory, port, modules = [], wsprotocol = 'wrs_prtc') {
        this.directory = directory;
        this.port = port;
        this.wsprotocol = wsprotocol;
        this.app = express_1.default();
        this.server = HTTP.createServer(this.app);
        this.wsserver = new WS.server({ httpServer: this.server, autoAcceptConnections: false });
        this.events = new component_1.Emitter();
        this.console = new component_1.Console('WRS');
        this.connections = [];
        this.services = [];
        this.modules = [];
        this.models = [];
        this.codes = component_2.Codes;
        let srv = [], mods = modules.slice();
        this.console.node('version', process.version);
        this.console.info('starting WRS at port', port);
        this.initModules(mods, srv)
            .initServices(srv)
            .injectModules();
        this.events.once('service.all.ready', () => {
            this.console.service('all services initialized');
            this.initHttp().initWS().start();
        });
        this.events.on('server.broadcast', (event) => { this.broadcast(event.data.class, event.data.data, event.data.filter); });
        this.wsprotocol = this.wsprotocol.toLowerCase();
    }
    /** Initialize modules compiled in the server */
    initModules(modules, services, dependencies = null) {
        this.console.module('initializing ' + (dependencies ? dependencies.constructor.name + ' dependencies' : 'modules') + ':', modules.map(x => x.name));
        modules.forEach(mod => {
            if (!this.modules.find(m => m.constructor == mod)) {
                let nmod = new mod();
                this.modules.push(nmod);
                services.push(...nmod.services);
                this.codes.push(...nmod.codes.filter(code => !this.codes.includes(code)));
                this.initModules(nmod.dependencies, services, nmod);
            }
        });
        return this;
    }
    /** Initialize services used by all the server applications (server, modules, controllers) */
    initServices(services) {
        let uniqueServices = services.filter((v, i, a) => a.indexOf(v) == i), svsReady = uniqueServices.map(x => false);
        this.console.service('initializing services:', uniqueServices.map(x => x.name));
        uniqueServices.forEach((s, i) => {
            this.events.once('service.ready', () => {
                svsReady[i] = true;
                this.console.service('service', s.name, 'ready');
                if (svsReady.every(x => x)) {
                    this.events.fire('service.all.ready');
                }
            }, s.name);
            let serv = new s(this.events);
            this.services.push(serv);
        });
        return this;
    }
    /** Inject services in all the used modules */
    injectModules() {
        this.modules.forEach(mod => {
            mod.inject(this.services);
            this.console.module('module', mod.constructor.name, 'initialized');
        });
        return this;
    }
    /** Initialize the Http Express Server for accepting WS protocol and rejecting all methods (get excluded) */
    initHttp() {
        let staticPath = PATH.join(this.directory, WRServer.root);
        this.console.info('serving client from', PATH.resolve(staticPath));
        this.app.use(express_1.default.static(staticPath));
        this.app.use(BODYPARSER.json());
        this.app.use((err, req, res, next) => { this.error(err, req.url, res); });
        this.app.get('*', (req, res) => { this.get(req, res); });
        this.app.post('*', (req, res) => { this.badMethod(res); });
        this.app.delete('*', (req, res) => { this.badMethod(res); });
        this.app.purge('*', (req, res) => { this.badMethod(res); });
        this.app.put('*', (req, res) => { this.badMethod(res); });
        this.app.options('*', (req, res) => { this.badMethod(res); });
        this.app.options('*', (req, res) => { this.badMethod(res); });
        return this;
    }
    /** Initialize websocket for accepting ws protocol request */
    initWS() {
        this.wsserver.on('request', req => { this.wsrequest(req); });
        return this;
    }
    /** Start server listening */
    start() {
        this.server.listen(this.port, () => { this.events.emit('server.ready'); this.console.info('server started'); });
        return this;
    }
    /** Send Server Internal Error to Http Response */
    error(error, url, res) {
        this.console.error('Error on path %s\n%s\n', url, error.stack);
        this.events.emit('server.error', error);
        res.status(500).send((process.env.NODE_ENV == 'production') ? 'Internal Server Error' : error.stack.replace(/(?:\r\n|\r|\n)/g, '<br />'));
        return this;
    }
    /** Get method callback (allowed for ws handshake) */
    get(req, res) {
        this.console.connection('http connection accepted from', req.headers['x-forwarded-for'] || req.connection.remoteAddress);
        res.sendFile(PATH.resolve(PATH.join(this.directory, WRServer.root, 'index.html')));
        return this;
    }
    /** Send Bad Method to Http Response */
    badMethod(res) {
        component_1.Connection.HttpBad(res, 405, 'bad method', this.codes);
        return this;
    }
    /** Elaborate websoket request */
    wsrequest(req) {
        if (!this.protocolAllowed(req.requestedProtocols) || !this.originIsAllowed(req.origin)) {
            req.reject();
            let ip = '???';
            try {
                ip = req.connection.remoteAddress;
            }
            catch (e) { }
            this.console.connection('ws connection rejected from', ip);
        }
        else {
            try {
                let conn = new component_1.Connection(req.accept(this.wsprotocol, req.origin), this.events, this.codes, this.modules);
                this.connections.push(conn);
            }
            catch (e) {
                this.console.error(e);
                try {
                    req.reject();
                }
                catch (e) {
                    this.console.error(e);
                }
            }
        }
        return this;
    }
    /** Origin Allow callback for ws requests */
    originIsAllowed(origin) { return true; }
    /** Protocol Allow callback for ws requests */
    protocolAllowed(protocols) { return Array.isArray(protocols) && protocols.length && protocols.includes(this.wsprotocol); }
    /** Send a structured ok message to all the filtered connections */
    broadcast(cls, data, filter) {
        let wscn = this.connections;
        if (typeof filter == 'function') {
            wscn = wscn.filter((c, i, cs) => filter.call(c, c.get('auth'), i, cs));
        }
        wscn.forEach(ws => { ws.ok(cls, data); });
        return this;
    }
    /** Enstabilish the static root for the server */
    static withRoot(directory) { this.root = directory; return this; }
}
WRServer.root = 'client';
exports.WRServer = WRServer;
