import { Controller } from '../controller';
import { Connection, IConnectionIncomingParsed, IConnectionOutcome, Emitter } from '../component';
import { Service } from '../service';
import { ModelBase } from '../models';
import { Event } from '../events';

export type ModuleType = typeof Module;

/** Module package for server service and models injection */
export abstract class Module {
    protected abstract controllers: (typeof Controller)[];
    protected abstract models: typeof ModelBase[];
    
    public abstract services: typeof Service[];
    public abstract dependencies: typeof Module[];
    public codes: string[] = [];

    private _services: { [name: string]: Service };
    private _models: { [name: string]: typeof ModelBase };

    constructor(protected events: Emitter){}

    /** Inject service and calculate models to use in this module */
    public inject(services: Service[]){
        this._services = {};
        this.services.forEach(s => { let serv = services.find(u => u.constructor == s); this._services[s.name] = serv; });
        this._models = {};
        this.models.forEach(m => { this._models[m.name] = m; });
        return this;
    }

    /** Digest a parsed message, finding the correct Controller */
    public digest(connection: Connection, message: IConnectionIncomingParsed): IConnectionOutcome {
        let cnt = this.controllers.find(c => c.section == message.section);
        if(cnt){
            let cm: Controller = new (cnt as any)(connection, this.events, this._services, this._models);
            this.events.emit<Event.Module.Digest.Type>(Event.Module.Digest.Name, cm);
            return cm.digest(message);
        }
        return null
    }
}