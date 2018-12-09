import { Emitter } from "../component";
export declare type ServiceType = typeof Service;
/** Service Base class [your services should extend this class and have 'Service' at the end of the name] */
export declare abstract class Service {
    protected events: Emitter;
    constructor(events: Emitter);
    /** Fire the ready event for initialize the server */
    protected ready(): this;
}
