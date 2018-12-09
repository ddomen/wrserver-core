import * as WS from 'websocket';
import { Emitter } from './emitter.component';
import { Module } from '../module';
export interface IConnectionIncomingMessage {
    type: 'utf8' | 'binary';
    utf8Data: string;
}
export interface IConnectionIncomingParsed {
    target: string;
    section: string;
    page: string;
    option: string;
    id: number;
    data: any;
}
export interface IConnectionOutcomeMessage {
    class: string;
    data: any;
    id?: number;
}
export interface IConnectionOutcomeBadMessage {
    code: string;
    message: string;
    bad: boolean;
}
export declare type IConnectionOutcome = IConnectionOutcomeMessage | IConnectionOutcomeBadMessage | Symbol | string;
export declare class Connection {
    protected socket: WS.connection;
    protected events: Emitter;
    protected codes: string[];
    protected modules: Module[];
    protected data: any;
    constructor(socket: WS.connection, events: Emitter, codes: string[], modules: Module[]);
    readonly wsid: number;
    readonly ip: string;
    protected init(): this;
    protected onRise(): this;
    protected onDrop(): this;
    protected onClose(code: number, reason: string): this;
    protected onError(error: Error): this;
    protected onPing(): this;
    protected onMessage(message: IConnectionIncomingMessage): this;
    protected onParsed(message: IConnectionIncomingParsed): this;
    get<T = any>(name: string, def?: T): T;
    set<T = any>(name: string, value: T, overwrite?: boolean): this;
    send(message: any, json?: boolean, binary?: boolean): this;
    pong(): this;
    badResponse(code?: number, message?: any, id?: number): this;
    bad(code?: string, message?: any, id?: number): this;
    okResponse(cls: string, data: any, id?: number): this;
    ok(cls: string, data: any, id?: number): this;
    broadcast(cls: string, data: any, filter?: (connection: Connection, index: number, array: Connection[]) => boolean): this;
    file(cls: string, path: string, id?: number, json?: boolean): this;
    getCode(code?: string | number): number;
    static getCode(codes: string[], code?: string | number): number;
    static HttpBad(res: any, status: number, code: string | number, codes: string[]): any;
    static HttpOk(res: any, cls: string, data: any, codes: string[]): any;
    static HttpFile(res: any, cls: string, path: string, codes: string[]): void;
}
export declare class ConnectionResponse {
    id: number;
    code: number;
    message: any;
    ok: boolean;
    statusCode: string;
    constructor(id: number, code: number, message: any, codes: string[]);
    set(index: 'code' | 'message', value?: any): this;
}
