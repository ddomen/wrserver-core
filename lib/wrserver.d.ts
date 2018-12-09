/// <reference types="node" />
import EXPRESS from 'express';
import * as WS from 'websocket';
import * as HTTP from 'http';
import { Connection, Emitter, Console } from './component';
import { Service } from './service';
import { Module } from './module';
import { ModelBase } from './models';
export declare abstract class AbstractTypeClass {
}
export declare type Prototyped = {
    prototype: object;
    [key: string]: any;
};
export declare type Abstract = Function & Prototyped;
export declare type Constructor = {
    new (...args: any[]): any;
    [key: string]: any;
};
export declare type Class = Abstract | Constructor;
export declare type ClassOf<T> = Class & T;
export declare type Instance<U = any, T extends U = any> = T;
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
    protected initModules(modules: typeof Module[], services: typeof Service[], dependencies?: Module): this;
    protected initServices(services: typeof Service[]): this;
    protected injectModules(): this;
    protected initHttp(): this;
    protected initWS(): this;
    protected start(): this;
    protected error(error: Error, url: string, res: EXPRESS.Response): this;
    protected get(req: EXPRESS.Request, res: EXPRESS.Response): this;
    protected badMethod(res: EXPRESS.Response): this;
    protected wsrequest(req: WS.request): this;
    protected originIsAllowed(origin: string): boolean;
    protected protocolAllowed(protocols: string[]): boolean;
    broadcast(cls: string, data: any, filter?: (value: any, index: number, array: Connection[]) => boolean): this;
    static withRoot(directory: string): typeof WRServer;
    protected static root: string;
}
