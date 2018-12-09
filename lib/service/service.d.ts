import { Emitter } from "../component";
export declare type ServiceType = typeof Service;
export declare abstract class Service {
    protected events: Emitter;
    constructor(events: Emitter);
    protected ready(): this;
}
