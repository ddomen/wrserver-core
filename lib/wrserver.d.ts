/// <reference types="node" />
import EXPRESS from 'express';
import * as WS from 'websocket';
import * as HTTP from 'http';
import { Connection, Emitter, Console } from './component';
import { Service } from './service';
import { Module } from './module';
import { ModelBase } from './models';
/** Abstract Class for type inference */
export declare abstract class AbstractTypeClass {
}
/** Type of a prototyped object */
export declare type Prototyped = {
    prototype: object;
    [key: string]: any;
};
/** Abstract Class type */
export declare type Abstract = Function & Prototyped;
/** Type of an object with a constructor method */
export declare type Constructor = {
    new (...args: any[]): any;
    [key: string]: any;
};
/** Class type */
export declare type Class = Abstract | Constructor;
export declare type ClassOf<T> = Class & T;
/** An "any" Instance of a specified class */
export declare type Instance<U = any, T extends U = any> = T;
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
export declare class WRServer {
    protected directory: string;
    protected port: number;
    protected wsprotocol: string;
    protected app: any;
    protected server: HTTP.Server;
    protected wsserver: WS.server;
    protected events: Emitter;
    protected console: Console;
    protected connections: Connection[];
    protected services: Service[];
    protected modules: Module[];
    protected models: (typeof ModelBase)[];
    protected codes: string[];
    constructor(directory: string, port: number, modules?: typeof Module[], wsprotocol?: string);
    /** Initialize modules compiled in the server */
    protected initModules(modules: typeof Module[], services: typeof Service[], dependencies?: Module): this;
    /** Initialize services used by all the server applications (server, modules, controllers) */
    protected initServices(services: typeof Service[]): this;
    /** Inject services in all the used modules */
    protected injectModules(): this;
    /** Initialize the Http Express Server for accepting WS protocol and rejecting all methods (get excluded) */
    protected initHttp(): this;
    /** Initialize websocket for accepting ws protocol request */
    protected initWS(): this;
    /** Start server listening */
    protected start(): this;
    /** Send Server Internal Error to Http Response */
    protected error(error: Error, url: string, res: EXPRESS.Response): this;
    /** Get method callback (allowed for ws handshake) */
    protected get(req: EXPRESS.Request, res: EXPRESS.Response): this;
    /** Send Bad Method to Http Response */
    protected badMethod(res: EXPRESS.Response): this;
    /** Elaborate websoket request */
    protected wsrequest(req: WS.request): this;
    /** Origin Allow callback for ws requests */
    protected originIsAllowed(origin: string): boolean;
    /** Protocol Allow callback for ws requests */
    protected protocolAllowed(protocols: string[]): boolean;
    /** Send a structured ok message to all the filtered connections */
    broadcast(cls: string, data: any, filter?: (value: any, index: number, array: Connection[]) => boolean): this;
    /** Enstabilish the static root for the server */
    static withRoot(directory: string): typeof WRServer;
    protected static root: string;
}
