import { Emitter } from "../component";
/** Type of Service */
export declare type ServiceType = typeof Service;
/** Service Base class [your services should extend this class and have 'Service' at the end of the name] */
export declare abstract class Service {
    protected events: Emitter;
    dependencies: ServiceType[];
    constructor(events: Emitter);
    protected init(): this;
    /** Fire the ready event for initialize the server */
    protected ready(): this;
}
