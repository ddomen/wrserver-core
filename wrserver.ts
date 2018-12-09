import EXPRESS from 'express';
import * as WS from 'websocket';
import * as BODYPARSER from 'body-parser';
import * as HTTP from 'http';
import * as PATH from 'path';

import { Connection, Emitter, Console } from './component';
import { Service } from './service';
import { Module } from './module';
import { Codes } from './component';
import { ModelBase } from './models';
import { Event } from './events';

/** Abstract Class for type inference */
export abstract class AbstractTypeClass{}
/** Type of a prototyped object */
export type Prototyped = { prototype: object, [key: string]: any };
/** Abstract Class type */
export type Abstract = Function & Prototyped;
/** Type of an object with a constructor method */
export type Constructor = { new (...args: any[]): any, [key: string]:any };
/** Class type */
export type Class = Abstract | Constructor;
export type ClassOf<T> = Class & T;
/** An "any" Instance of a specified class */
export type Instance<U = any, T extends U = any> = T;

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
export class WRServer {
    protected app: any = EXPRESS();
    protected server: HTTP.Server = HTTP.createServer(this.app);
    protected wsserver: WS.server = new WS.server({ httpServer: this.server, autoAcceptConnections: false });

    protected events: Emitter = new Emitter();
    protected console: Console = new Console('WRS');
    protected connections: Connection[] = [];
    protected services: Service[] = [];
    protected modules: Module[] = [];
    protected models: (typeof ModelBase)[] = [];
    protected codes: string[] = Codes;

    constructor(
        protected directory: string,
        protected port: number,
        modules: typeof Module[] = [],
        protected wsprotocol: string = 'wrs_prtc'
    ){
        let srv: typeof Service[] = [],
            mods: typeof Module[] = modules.slice()
        this.console.node('version', process.version)
        this.console.info('starting WRS at port', port);
        this.initModules(mods, srv)
            .initServices(srv)
            .injectModules();
        
        this.events.once('service.all.ready', () => {
            this.console.service('all services initialized');
            this.initHttp().initWS().start();
        })
        this.events.on('server.broadcast', (data: Event.Server.Broadcast) => { this.broadcast(data.class, data.data, data.filter); });

        this.wsprotocol = this.wsprotocol.toLowerCase();
    }
    
    /** Initialize modules compiled in the server */
    protected initModules(modules: typeof Module[], services: typeof Service[], dependencies: Module = null){
        this.console.module('initializing ' + (dependencies ? dependencies.constructor.name + ' dependencies' : 'modules') + ':', modules.map(x => x.name));
        modules.forEach(mod => {
            if(!this.modules.find(m => m.constructor == mod)){
                let nmod: Module = new (mod as any)();
                this.modules.push(nmod);
                services.push(...nmod.services);
                this.codes.push(...nmod.codes.filter(code => !this.codes.includes(code)));
                this.initModules(nmod.dependencies, services, nmod);
            }
        })
        return this;
    }

    /** Initialize services used by all the server applications (server, modules, controllers) */
    protected initServices(services: typeof Service[]){
        let uniqueServices = services.filter((v, i, a) => a.indexOf(v) == i),
            svsReady = uniqueServices.map(x => false);
        this.console.service('initializing services:', uniqueServices.map(x => x.name));
        uniqueServices.forEach((s, i) => {
            this.events.once('service.ready', ()=>{
                svsReady[i] = true;
                this.console.service('service', s.name, 'ready')
                if(svsReady.every(x => x)){ this.events.fire('service.all.ready'); }
            }, s.name);
            let serv = new (s as any)(this.events);
            this.services.push(serv);
        })
        return this;
    }

    /** Inject services in all the used modules */    
    protected injectModules(){
        this.modules.forEach(mod => {
            mod.inject(this.services)
            this.console.module('module', mod.constructor.name, 'initialized');
        });
        return this;
    }
    
    /** Initialize the Http Express Server for accepting WS protocol and rejecting all methods (get excluded) */
    protected initHttp(): this{
        let staticPath = PATH.join(this.directory, WRServer.root);
        this.console.info('serving client from', PATH.resolve(staticPath))
        this.app.use(EXPRESS.static(staticPath));
        this.app.use(BODYPARSER.json());
        this.app.use((err: Error, req: EXPRESS.Request, res: EXPRESS.Response, next: EXPRESS.NextFunction) => { this.error(err, req.url, res); });

        this.app.get('*', (req: EXPRESS.Request, res: EXPRESS.Response) => { this.get(req, res); });
        this.app.post('*', (req: EXPRESS.Request, res: EXPRESS.Response) => { this.badMethod(res); });
        this.app.delete('*', (req: EXPRESS.Request, res: EXPRESS.Response) => { this.badMethod(res); });
        this.app.purge('*', (req: EXPRESS.Request, res: EXPRESS.Response) => { this.badMethod(res); });
        this.app.put('*', (req: EXPRESS.Request, res: EXPRESS.Response) => { this.badMethod(res); });
        this.app.options('*', (req: EXPRESS.Request, res: EXPRESS.Response) => { this.badMethod(res); });
        this.app.options('*', (req: EXPRESS.Request, res: EXPRESS.Response) => { this.badMethod(res); });

        return this;
    }

    /** Initialize websocket for accepting ws protocol request */
    protected initWS(): this{
        this.wsserver.on('request', req => { this.wsrequest(req); });
        return this;
    }

    /** Start server listening */
    protected start(): this{
        this.server.listen(this.port, () => { this.events.emit('server.ready'); this.console.info('server started'); });
        return this;
    }

    /** Send Server Internal Error to Http Response */
    protected error(error: Error, url: string, res: EXPRESS.Response): this{
        this.console.error('Error on path %s\n%s\n', url, error.stack);
        this.events.emit('server.error', error);
        res.status(500).send((process.env.NODE_ENV == 'production') ? 'Internal Server Error' : error.stack.replace(/(?:\r\n|\r|\n)/g, '<br />'));
        return this;
    }

    /** Get method callback (allowed for ws handshake) */
    protected get(req: EXPRESS.Request, res: EXPRESS.Response): this{
        this.console.connection('http connection accepted from', req.headers['x-forwarded-for'] || req.connection.remoteAddress)
        res.sendFile(PATH.resolve(PATH.join(this.directory, WRServer.root, 'index.html')));
        return this;
    }

    /** Send Bad Method to Http Response */
    protected badMethod(res: EXPRESS.Response): this{
        Connection.HttpBad(res, 405, 'bad method', this.codes);
        return this;
    }

    /** Elaborate websoket request */
    protected wsrequest(req: WS.request): this{
        if(!this.protocolAllowed(req.requestedProtocols) || !this.originIsAllowed(req.origin)) {
            req.reject(); let ip = '???';
            try{ ip = (req as any).connection.remoteAddress; } catch(e){}
            this.console.connection('ws connection rejected from', ip);
        }
        else{
            try{
                let conn = new Connection(req.accept(this.wsprotocol, req.origin), this.events, this.codes, this.modules)
                this.connections.push(conn);
            }
            catch(e){ this.console.error(e); try{ req.reject(); } catch(e){ this.console.error(e); } }
        }
        return this;
    }
    /** Origin Allow callback for ws requests */
    protected originIsAllowed(origin: string): boolean{ return true; }
    /** Protocol Allow callback for ws requests */
    protected protocolAllowed(protocols: string[]): boolean{ return Array.isArray(protocols) && protocols.length && protocols.includes(this.wsprotocol); }

    /** Send a structured ok message to all the filtered connections */
    public broadcast(cls: string, data: any, filter?: (value: any,  index: number, array: Connection[]) => boolean): this{
        let wscn = this.connections;
        if(typeof filter == 'function'){ wscn = wscn.filter((c,i,cs) => filter.call(c, c.get('auth'), i, cs)); }
        wscn.forEach(ws => { ws.ok(cls, data); })
        return this;
    }

    /** Enstabilish the static root for the server */
    public static withRoot(directory: string){ this.root = directory; return this; }
    protected static root: string = 'client';
}
