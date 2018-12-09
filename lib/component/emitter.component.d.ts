import { Event } from '../events';
export declare type EmitterCallback<T = any> = (event: EventModel<T>) => void;
export declare class Emitter {
    private handlers;
    private responders;
    private composers;
    private fired;
    private readonly htypes;
    /** Emit an event */
    emit<T = any>(type: string, data?: T, name?: string, like?: boolean): this;
    /** Emit an event only if is not already emitted */
    fire<T = any>(type: string, data?: T, name?: string, like?: boolean): this;
    /** Execute the callback every time receives a type event */
    on<T = any>(type: string, callback: EmitterCallback<T>, name?: string, times?: number, like?: boolean): this;
    /** Remove handlers for type events */
    off(type: string, name?: string): this;
    /** Execute the callback the first time receives a type event.
     *
        If the event is already emitted execute the callback for the first emitted type event */
    once<T = any>(type: string, callback: EmitterCallback<T>, name?: string): this;
    /** Execute the callback the first time receives a type[] event.
     *
        If the event is already emitted execute the callback for the first emitted type[] event */
    onces<T = any>(types: string[], callback: EmitterCallback<T>, name?: string): this;
    /** Execute the callback every time receives a type[] event */
    ons<T = any>(types: string[], callback: EmitterCallback<T>, name?: string, times?: number): this;
    /** Execute the callback every time receives a type-like event (event type match callback type) */
    like<T = any>(type: string, callback: EmitterCallback<T>, name?: string, times?: number): this;
    /** Make a request to retrive the result of a responder type event */
    request<T = any, U extends Event.Event = Event.Any>(type: string, event: EventModel<U>): T;
    /** Respond to an type event with a result */
    respond<T = any>(type: string, response: EventModel<T> | EmitterCallback<T>, callable?: boolean, name?: string, times?: number): this;
    /** Make a composed request and add it to the composed handlers.
     
        A comopsed request will trig if there is at least one composer element that is equal to decompose event.

        A function in the composer stack will be evaluate before the comparison if callable parameter is set to true (default: true).

        compose(0) <=> decompose(0)

        compose([0,1,2]) <=> decompose(0) | decompose(1) | decompose(2)

        compose([0,1,(x) => x*2 == 12]) <=> decompose(0) | decompose(1) | decompose(6)
    */
    compose<T = any>(composer: T, callback: Function, callable?: boolean, name?: string, times?: number): this;
    /** Execute the callback of a composed request. See compose for more info. */
    decompose<T = any>(composer: T, data?: any, name?: string): this;
    /** Check if an event has already fired at least once */
    hasFired(type: string, name?: string): number;
}
export declare class EventModel<T = any> {
    type: string;
    name: string;
    data: T;
    constructor(type: string, name?: string, data?: T);
}
declare class Handler {
    name: string;
    times: number;
    protected count: number;
    constructor(name: string, times?: number);
    readonly elasped: boolean;
}
export declare class HandlerModel<H = any> extends Handler {
    callback: EmitterCallback<H>;
    like: boolean;
    constructor(name: string, callback: EmitterCallback<H>, times?: number, like?: boolean);
    call<T = any>(event: EventModel<T>): this;
}
export declare class ResponderModel<R = any> extends Handler {
    response: EventModel<R> | EmitterCallback<R>;
    callable: boolean;
    constructor(name: string, response: EventModel<R> | EmitterCallback<R>, callable?: boolean, times?: number);
    respond(event: EventModel<R>): R;
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
