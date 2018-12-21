import { ControllerType } from '../controller';
import { Connection, IConnectionIncomingParsed, IConnectionOutcome, Emitter, Interceptor, InterceptorCollection } from '../component';
import { Service, ServiceType } from '../service';
import { ModelType } from '../models';
/** Type of Module */
export declare type ModuleType = typeof Module;
/** Module package for server service and models injection */
export declare abstract class Module {
    protected events: Emitter;
    protected controllers: ControllerType[];
    protected models: ModelType[];
    services: ServiceType[];
    dependencies: ModuleType[];
    interceptors: Interceptor[];
    codes: string[];
    private _services;
    private _models;
    protected readonly _interceptors: InterceptorCollection<any>;
    constructor(events: Emitter);
    /** Inject service and calculate models to use in this module */
    inject(services: Service[]): this;
    /** Digest a parsed message, finding the correct Controller */
    digest(connection: Connection, message: IConnectionIncomingParsed): IConnectionOutcome;
    protected makeController(connection: Connection, message: IConnectionIncomingParsed, cnt: ControllerType): IConnectionOutcome;
}
