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
const events_1 = require("./events");
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
        this.connections = [];
        this.services = [];
        this.modules = [];
        this.interceptors = new component_1.InterceptorCollection();
        this.models = [];
        this.codes = component_2.Codes;
        if (!PATH.isAbsolute(this.directory)) {
            this.directory = PATH.join(process.cwd(), this.directory);
        }
        this.console = new component_1.Console('WRS', this.directory);
        let srv = [], mods = modules.slice();
        this.console.node('version', process.version);
        this.console.info('starting WRS at port', port);
        this.initModules(mods, srv)
            .initServices(srv)
            .injectModules()
            .injectServices();
        this.events.once(events_1.Event.Service.AllReady.Name, () => {
            this.console.service('all services initialized');
            this.initHttp().initWS().start();
        });
        this.events.on(events_1.Event.Server.Broadcast.Name, event => { this.broadcast(event.data); });
        this.wsprotocol = this.wsprotocol.toLowerCase();
    }
    /** Initialize modules compiled in the server */
    initModules(modules, services, dependencies = null) {
        this.console.module('initializing ' + (dependencies ? dependencies.constructor.name + ' dependencies' : 'modules') + ':', modules.map(x => x.name));
        if (modules.length) {
            modules.forEach(mod => {
                if (!this.modules.find(m => m.constructor == mod)) {
                    let nmod = new mod(this.events);
                    this.modules.push(nmod);
                    services.push(...nmod.services);
                    this.codes.push(...nmod.codes.filter(code => !this.codes.includes(code)));
                    this.initModules(nmod.dependencies, services, nmod);
                    this.interceptors.push(...nmod.interceptors);
                }
            });
        }
        else {
            this.events.fire(events_1.Event.Service.AllReady.Name);
        }
        return this;
    }
    /** Initialize services used by all the server applications (server, modules, controllers) */
    initServices(services) {
        let uniqueServices = services.filter((v, i, a) => a.indexOf(v) == i).map(service => ({ service: null, type: service }));
        this.console.service('initializing services:', uniqueServices.map(x => x.type.name));
        uniqueServices.forEach(x => {
            this.events.once(events_1.Event.Service.Ready.Name, () => {
                this.console.service('service', x.type.name, 'ready');
                uniqueServices
                    .filter(y => y.service && y.service.dependencies && y.service.dependencies.includes(x.type))
                    .filter(y => y.service.dependencies.every(z => { let type = uniqueServices.find(u => u.type == z); return type && !!type.service; }))
                    .forEach(y => y.service.init(...y.service.dependencies.map(d => uniqueServices.find(u => u.type == d).service)));
                if (!uniqueServices.some(x => !x.service)) {
                    this.events.fire(events_1.Event.Service.AllReady.Name);
                }
            }, x.type.name);
            x.service = new x.type(this.directory, this.events);
            this.services.push(x.service);
            this.interceptors.inject(x.service);
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
    /** Inject Interceptors to services */
    injectServices() {
        this.services.forEach(srv => {
            srv.inject(this.interceptors);
            this.console.service('service', srv.constructor.name, 'injected');
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
        this.app.post('*', (req, res) => { this.badMethod(req, res); });
        this.app.delete('*', (req, res) => { this.badMethod(req, res); });
        this.app.purge('*', (req, res) => { this.badMethod(req, res); });
        this.app.put('*', (req, res) => { this.badMethod(req, res); });
        this.app.options('*', (req, res) => { this.badMethod(req, res); });
        this.app.options('*', (req, res) => { this.badMethod(req, res); });
        return this;
    }
    /** Initialize websocket for accepting ws protocol request */
    initWS() {
        this.wsserver.on('request', req => { this.wsrequest(req); });
        return this;
    }
    /** Start server listening */
    start() {
        this.server.listen(this.port, () => {
            this.console.info('server started');
            this.events.emit(events_1.Event.Server.Ready.Name, null);
        });
        return this;
    }
    /** Send Server Internal Error to Http Response */
    error(error, url, res) {
        this.console.error('Error on path %s\n%s\n', url, error.stack);
        this.events.emit(events_1.Event.Server.Error.Name, error);
        res.status(500).send((process.env.NODE_ENV == 'production') ? 'Internal Server Error' : error.stack.replace(/(?:\r\n|\r|\n)/g, '<br />'));
        return this;
    }
    /** Get method callback (allowed for ws handshake) */
    get(req, res) {
        this.console.connection('http connection accepted from', req.headers['x-forwarded-for'] || req.connection.remoteAddress);
        this.events.emit(events_1.Event.Server.Url.Name, req);
        res.sendFile(PATH.resolve(PATH.join(this.directory, WRServer.root, 'index.html')));
        return this;
    }
    /** Send Bad Method to Http Response */
    badMethod(req, res) {
        this.events.emit(events_1.Event.Server.BadMethod.Name, req);
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
            this.events.emit(events_1.Event.Websocket.Reject.Name, req);
        }
        else {
            try {
                let conn = new component_1.Connection(req.accept(this.wsprotocol, req.origin), this.events, this.codes, this.modules, this.interceptors);
                this.connections.push(conn);
                this.events.emit(events_1.Event.Websocket.Accept.Name, conn);
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
    broadcast(message, filter) {
        let connections = this.connections;
        if (typeof filter == 'function') {
            connections = connections.filter(filter);
        }
        connections.forEach(connection => { connection.send(message); });
        return this;
    }
    /** Enstabilish the static root for the server */
    static withRoot(directory) { this.root = directory; return this; }
}
WRServer.root = 'client';
exports.WRServer = WRServer;
