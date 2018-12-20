import { Emitter } from "../component";
import { Event } from "../events";

/** Type of Service */
export type ServiceType = typeof Service;

/** Service Base class [your services should extend this class and have 'Service' at the end of the name] */
export abstract class Service {
    public dependencies: ServiceType[] = [];

    constructor(protected events: Emitter){ }

    protected init(): this{ return this; }

    /** Fire the ready event for initialize the server */
    protected ready(): this{
        this.events.fire<Event.Service.Ready.Type>(Event.Service.Ready.Name, this, this.constructor.name);
        return this;
    }
}