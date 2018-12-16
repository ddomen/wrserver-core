import { Connection, IConnectionIncomingParsed, IConnectionOutcome, Emitter } from '../component';
import { Service } from "../service";
import { ModelBase } from "../models";
/** Controller interface for default method */
export interface IControllerDefault {
    default(message: IConnectionIncomingParsed): IConnectionOutcome;
}
/** Type of Controller */
export declare type ControllerType = typeof Controller;
/** Type of Page */
export declare type Page = (message: IConnectionIncomingParsed) => IConnectionOutcome;
/** Controller Base class [your controllers should extends this class and have 'Controller' at the end of the name]

 * Every method linked to a page should return a 'ConnectionOutcome'
*/
export declare abstract class Controller {
    protected connection: Connection;
    protected events: Emitter;
    protected services: {
        [name: string]: any;
    };
    protected models: {
        [name: string]: any;
    };
    constructor(connection: Connection, events: Emitter, services: {
        [name: string]: any;
    }, models: {
        [name: string]: any;
    });
    /** Digest a parsed message in an readable response */
    digest(message: IConnectionIncomingParsed): IConnectionOutcome;
    /** Return a readable ok response, with class, and data converted to sendable (if method is present) */
    protected ok(cls: string, data: any, sendableArgs?: any[]): IConnectionOutcome;
    /** Return a readable bad response, reporting message with specific code */
    protected bad(code?: string, message?: string): IConnectionOutcome;
    /** Retrive a model by its name. Usefull to convert model in desired model type */
    protected model<T = typeof ModelBase>(name: string | typeof ModelBase): T;
    /** Retrive a service by its name. Usefull to convert service in desired model type */
    protected service<T extends Service = Service>(name: string | typeof Service): T;
    static section: string;
    /** Impossible to digest (missing page - linked method) Symbol */
    static NotDig: Symbol;
    /** Bad digestion (wrong response of page - linked method) Symbol */
    static BadDig: Symbol;
}
