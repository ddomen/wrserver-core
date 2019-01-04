import { Emitter, InterceptorCollection, Interceptor, Console } from "../component";
/** Type of Service */
export declare type ServiceType = typeof Service;
/** Service Base class [your services should extend this class and have 'Service' at the end of the name] */
export declare abstract class Service {
    protected directory: string;
    protected events: Emitter;
    protected console: Console;
    dependencies: ServiceType[];
    interceptors: Interceptor[];
    protected interceptorCollection: InterceptorCollection;
    constructor(directory: string, events: Emitter, console: Console);
    /** Inject interceptors to the Service */
    inject(interceptors: InterceptorCollection): this;
    /** Initilize the server, just after dependencies resolved.
     *
     * The dependencies are passed to this method by the order defined in the dependencies array of the service
     *
     * For example ```dependencies = [ ServiceType1, ServiceType2 ]``` will trigger ```init(ServiceInstance1, ServiceInstance2)``` */
    init(...dep: Service[]): this;
    /** Fire the ready event for initialize the server */
    protected ready(): this;
    protected static directory: string;
}
