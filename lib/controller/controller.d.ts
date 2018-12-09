import { Connection, IConnectionIncomingParsed, IConnectionOutcome } from '../component';
import { Service } from "../service";
import { ModelBase } from "../models";
export interface IControllerDefault {
    default(message: IConnectionIncomingParsed): IConnectionOutcome;
}
export declare type ControllerType = typeof Controller;
export declare abstract class Controller {
    protected connection: Connection;
    protected services: {
        [name: string]: any;
    };
    protected models: {
        [name: string]: any;
    };
    constructor(connection: Connection, services: {
        [name: string]: any;
    }, models: {
        [name: string]: any;
    });
    digest(message: IConnectionIncomingParsed): IConnectionOutcome;
    protected ok(cls: string, data: any, sendableArgs?: any[]): IConnectionOutcome;
    protected bad(code?: string, message?: string): IConnectionOutcome;
    protected model<T = typeof ModelBase>(name: string | typeof ModelBase): T;
    protected service<T extends Service = Service>(name: string | typeof Service): T;
    static section: string;
    static NotDig: Symbol;
    static BadDig: Symbol;
}
