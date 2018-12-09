import { Event } from '../events';
export declare class Emitter {
    private handlers;
    private responders;
    private composers;
    private fired;
    private readonly htypes;
    emit(type: string, data?: any, name?: string, like?: boolean): this;
    fire(type: string, data?: any, name?: string, like?: boolean): this;
    on(type: string, callback: Function, name?: string, times?: number, like?: boolean): this;
    off(type: string, name?: string): this;
    once(type: string, callback: Function, name?: string): this;
    onces(types: string[], callback: Function, name?: string): this;
    ons(types: string[], callback: Function, name?: string, times?: number): this;
    like(type: string, callback: Function, name?: string, times?: number): this;
    request<T = any, U extends Event.Event = Event.Any>(type: string, event: U): T;
    respond(type: string, response: any, callable?: boolean, name?: string, times?: number): this;
    compose<T = any>(composer: T, callback: Function, callable?: boolean, name?: string, times?: number): this;
    decompose<T = any>(composer: T, data?: any, name?: string): this;
    hasFired(type: string, name?: string): number;
}
export declare class EventModel {
    type: string;
    name: string;
    data: any;
    constructor(type: string, name?: string, data?: any);
}
declare class Handler {
    name: string;
    times: number;
    protected count: number;
    constructor(name: string, times?: number);
    readonly elasped: boolean;
}
export declare class HandlerModel extends Handler {
    callback: Function;
    like: boolean;
    constructor(name: string, callback: Function, times?: number, like?: boolean);
    call(event: EventModel): this;
}
export declare class ResponderModel extends Handler {
    response: any;
    callable: boolean;
    constructor(name: string, response: any, callable?: boolean, times?: number);
    respond(event: any): any;
}
export declare class ComposerModel<T = any> extends Handler {
    composer: T;
    callback: Function;
    callable: boolean;
    constructor(name: string, composer: T, callback: Function, times?: number, callable?: boolean);
    call(event: EventModel): this;
    protected decompose(target: any, composer?: any): any;
    compose(target: any, composer?: any): boolean;
}
export {};
