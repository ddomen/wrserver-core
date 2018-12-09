import { Controller } from '../controller';
import { Connection, IConnectionIncomingParsed, IConnectionOutcome } from '../component';
import { Service } from '../service';
import { ModelBase } from '../models';
export declare type ModuleType = typeof Module;
/** Module package for server service and models injection */
export declare abstract class Module {
    protected abstract controllers: (typeof Controller)[];
    protected abstract models: typeof ModelBase[];
    abstract services: typeof Service[];
    abstract dependencies: typeof Module[];
    codes: string[];
    private _services;
    private _models;
    /** Inject service and calculate models to use in this module */
    inject(services: Service[]): this;
    /** Digest a parsed message, finding the correct Controller */
    digest(connection: Connection, message: IConnectionIncomingParsed): IConnectionOutcome;
}
