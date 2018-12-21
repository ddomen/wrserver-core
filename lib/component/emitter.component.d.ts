import { Event } from '../events';
/** Callback that convert an EventModel<EventType> to Result for the Emitter events */
export declare type EmitterCallback<EventType extends Event = Event.Any.Type, Result = void> = (event: EventModel<EventType>) => Result;
/** Response type for a rised event (response for on, once, etc.) */
export declare type EventResponse<EventType extends Event = Event.Any.Type, Result = void> = EventModel<EventType> | EmitterCallback<EventType, Result>;
/** Crossed response for rised request (response for response method by request method) */
export declare type CrossedEventResponse<EventType extends Event = Event.Any.Type, Result = void> = EventModel<Result> | EmitterCallback<EventType, Result>;
/** Request for a event response (request for request method) */
export declare type EventRequest<EventType extends Event = Event.Any.Type> = EventType | EventModel<EventType>;
export declare class Emitter {
    private handlers;
    private responders;
    private composers;
    private fired;
    constructor();
    private readonly htypes;
    /** Emit an event */
    emit<EventType extends Event = Event.Any.Type>(type: string, data?: EventType, name?: string, like?: boolean): this;
    /** Emit an event only if is not already emitted */
    fire<EventType extends Event = Event.Any.Type>(type: string, data?: EventType, name?: string, like?: boolean): this;
    /** Execute the callback every time receives a type event */
    on<EventType extends Event = Event.Any.Type>(type: string, callback: EmitterCallback<EventType>, name?: string, times?: number, like?: boolean): this;
    /** Remove handlers for type events */
    off(type: string, name?: string): this;
    /** Execute the callback the first time receives a type event.
     *
        If the event is already emitted execute the callback for the first emitted type event */
    once<EventType extends Event = Event.Any.Type>(type: string, callback: EmitterCallback<EventType>, name?: string): this;
    /** Execute the callback the first time receives a type[] event.
     *
        If the event is already emitted execute the callback for the first emitted type[] event */
    onces<EventType extends Event = Event.Any.Type>(types: string[], callback: EmitterCallback<EventType>, name?: string): this;
    /** Execute the callback every time receives a type[] event */
    ons<EventType extends Event = Event.Any.Type>(types: string[], callback: EmitterCallback<EventType>, name?: string, times?: number): this;
    /** Execute the callback every time receives a type-like event (event type match callback type) */
    like<EventType extends Event = Event.Any.Type>(type: string, callback: EmitterCallback<EventType>, name?: string, times?: number): this;
    /** Make a request to retrive the result of a responder type event */
    request<Result = any, EventType extends Event = Event.Any.Type>(type: string, event: EventRequest<EventType>, name?: string): Result;
    /** Respond to an type event with a result */
    respond<Result = any, EventType extends Event = Event.Any.Type>(type: string, response: CrossedEventResponse<EventType, Result>, callable?: boolean, name?: string, times?: number): this;
    /** Make a composed request and add it to the composed handlers.
     
        A comopsed request will trig if there is at least one composer element that is equal to decompose event.

        A function in the composer stack will be evaluate before the comparison if callable parameter is set to true (default: true).

        compose(0) <=> decompose(0)

        compose([0,1,2]) <=> decompose(0) | decompose(1) | decompose(2)

        compose([0,1,(x) => x*2 == 12]) <=> decompose(0) | decompose(1) | decompose(6)
    */
    compose<EventType = any>(composer: EventType, callback: Function, callable?: boolean, name?: string, times?: number): this;
    /** Execute the callback of a composed request. See compose for more info. */
    decompose<EventType = any>(composer: EventType, data?: any, name?: string): this;
    /** Check if an event has already fired at least once */
    hasFired(type: string, name?: string): number;
    private static Instance;
}
export declare class EventModel<EventType extends Event = Event.Any.Type> {
    type: string;
    name: string;
    data: EventType;
    constructor(type: string, name?: string, data?: EventType);
}
declare class Handler {
    name: string;
    times: number;
    protected count: number;
    constructor(name: string, times?: number);
    readonly elasped: boolean;
}
export declare class HandlerModel<EventType extends Event = Event.Any.Type> extends Handler {
    callback: EmitterCallback<EventType>;
    like: boolean;
    constructor(name: string, callback: EmitterCallback<EventType>, times?: number, like?: boolean);
    call(event: EventModel<EventType>): this;
}
export declare class ResponderModel<Result = any, EventType extends Event = Event.Any.Type> extends Handler {
    response: CrossedEventResponse<EventType, Result>;
    callable: boolean;
    constructor(name: string, response: CrossedEventResponse<EventType, Result>, callable?: boolean, times?: number);
    respond(event: EventModel<EventType>): Result;
}
export declare class ComposerModel<EventType extends Event = Event.Any.Type> extends Handler {
    composer: EventType;
    callback: Function;
    callable: boolean;
    constructor(name: string, composer: EventType, callback: Function, times?: number, callable?: boolean);
    call(event: EventModel): this;
    protected decompose(target: any, composer?: any): any;
    compose(target: any, composer?: any): boolean;
}
export {};
