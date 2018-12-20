import { Emitter, InterceptorCollection, Interceptor } from "../component";
import { Event } from "../events";

/** Type of Service */
export type ServiceType = typeof Service;

/** Service Base class [your services should extend this class and have 'Service' at the end of the name] */
export abstract class Service {
    public dependencies: ServiceType[] = [];
    public interceptors: Interceptor[] = [];
    protected interceptorCollection: InterceptorCollection;

    constructor(protected events: Emitter){ }

    public inject(interceptors: InterceptorCollection): this{
        let ints = this.interceptors.filter(int => interceptors.check(int.type))
        this.interceptorCollection = new InterceptorCollection(ints);
        return this;
    }

    protected init(): this{ return this; }

    /** Fire the ready event for initialize the server */
    protected ready(): this{
        this.events.fire<Event.Service.Ready.Type>(Event.Service.Ready.Name, this, this.constructor.name);
        return this;
    }
}