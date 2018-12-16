import * as WS from 'websocket';
import { Emitter } from './emitter.component';
import { Module } from '../module';
/** Incoming not parsed message (raw utf8 - buffered) */
export interface IConnectionIncomingMessage {
    type: 'utf8' | 'binary';
    utf8Data: string;
}
/** Incoming parsed message */
export interface IConnectionIncomingParsed {
    target: string;
    section: string;
    page: string;
    option: string;
    id: number;
    data: any;
}
/** Outcoming structured ok message */
export interface IConnectionOutcomeMessage {
    class: string;
    data: any;
    id?: number;
}
/** Outcoming structured bad message */
export interface IConnectionOutcomeBadMessage {
    code: string;
    message: string;
    bad: boolean;
}
/** Outcoming helper for Controller returns */
export declare type IConnectionOutcome = ConnectionResponse | IConnectionOutcomeMessage | IConnectionOutcomeBadMessage | Symbol | string;
/** Filter function for connection broadcast */
export declare type filter = (connection: Connection, index: number, array: Connection[]) => boolean;
/** A Connection wrapper for ws.connection */
export declare class Connection {
    protected socket: WS.connection;
    protected events: Emitter;
    protected codes: string[];
    protected modules: Module[];
    protected data: any;
    constructor(socket: WS.connection, events: Emitter, codes: string[], modules: Module[]);
    /** Retrive current ws.message id */
    readonly wsid: number;
    /** Try to retrive ip of ws.connection */
    readonly ip: string;
    /** Initialize callbacks for the socket */
    protected init(): this;
    /** Event of initializing */
    protected onRise(): this;
    /** Event of dropping connection (fired when closed in any way - accidentally or not) */
    protected onDrop(): this;
    /** Event of closing connection (fired when not accidentally closed) */
    protected onClose(code: number, reason: string): this;
    /** Event of error in connection */
    protected onError(error: Error): this;
    /** Event when pinging the socket (ping - pong messages) */
    protected onPing(): this;
    /** Event fired when reciving message (still not parsed) */
    protected onMessage(message: IConnectionIncomingMessage): this;
    /** Event fired when receiving a parsed message */
    protected onParsed(message: IConnectionIncomingParsed): this;
    /** Get a connection custom data */
    get<T = any>(name: string, def?: T): T;
    /** Set a connection custom data (default overwrite? = true) */
    set<T = any>(name: string, value: T, overwrite?: boolean): this;
    /** Send simple message (not structured) to the socket */
    send(message: IConnectionOutcome, json?: boolean, binary?: boolean): this;
    /** Make a pong response to ping request */
    pong(): this;
    /** Send a bad (structured) response to the socket by numeric code [pref use 'bad' method] */
    badResponse(code?: number, message?: any, id?: number): this;
    /** Send a bad (structured) response to the socket by string codev */
    bad(code?: string, message?: any, id?: number): this;
    /** Send an ok (structured) response to the socket [pref use 'ok' method] */
    okResponse(cls: string, data: any, id?: number): this;
    /** Send an ok (structured) response to the socket with autogenerated codes */
    ok(cls: string, data: any, id?: number): this;
    /** Send an ok (structured) repsponse to all connections (filtered by filter param callback) */
    broadcast(cls: string, data: any, filter?: filter): this;
    /** Send a file trought the socket [experimental] */
    file(cls: string, path: string, id?: number, json?: boolean): this;
    /** Get the string code from numeric and vice-versa */
    getCode(code?: string | number): number;
    /** Get the string code from numeric and vice-versa */
    static getCode(codes: string[], code?: string | number): number;
    /** Send HttpBad Response from an Express Http Response */
    static HttpBad(res: any, status: number, code: string | number, codes: string[]): any;
    /** Send HttpOk Response from an Express Http Response */
    static HttpOk(res: any, cls: string, data: any, codes: string[]): any;
    /** Send HttpFile Response from an Express Http Response */
    static HttpFile(res: any, cls: string, path: string, codes: string[]): void;
}
/** Structured response for WebSocket Rest Server */
export declare class ConnectionResponse {
    id: number;
    code: number;
    message: any;
    ok: boolean;
    statusCode: string;
    constructor(id: number, code: number, message: any, codes: string[]);
    set(index: 'code' | 'message', value?: any): this;
}
