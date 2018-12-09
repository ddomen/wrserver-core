import { Controller } from '../controller';
import { Connection, IConnectionIncomingParsed, IConnectionOutcome } from '../component';
import { Service } from '../service';
import { ModelBase } from '../models';
export declare type ModuleType = typeof Module;
export declare abstract class Module {
    protected abstract controllers: (typeof Controller)[];
    protected abstract models: typeof ModelBase[];
    abstract services: typeof Service[];
    abstract dependencies: typeof Module[];
    codes: string[];
    private _services;
    private _models;
    inject(services: Service[]): this;
    digest(connection: Connection, message: IConnectionIncomingParsed): IConnectionOutcome;
}
