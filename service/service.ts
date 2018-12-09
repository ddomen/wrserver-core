import { Emitter } from "../component";

export type ServiceType = typeof Service;

/** Service Base class [your services should extend this class and have 'Service' at the end of the name] */
export abstract class Service {
    constructor(protected events: Emitter){ }

    /** Fire the ready event for initialize the server */
    protected ready(){
        this.events.fire('service.ready', this, this.constructor.name);
        return this;
    }
}