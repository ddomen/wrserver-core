"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../component");
const events_1 = require("../events");
/** Module package for server service and models injection */
class Module {
    constructor(events) {
        this.events = events;
        this.controllers = [];
        this.models = [];
        this.services = [];
        this.dependencies = [];
        this.interceptors = [];
        this.codes = [];
    }
    /** Inject service and calculate models and interceptors to use in this module */
    inject(services) {
        this._services = {};
        this.services.forEach(s => { let serv = services.find(u => u.constructor == s); this._services[s.name] = serv; });
        this._models = {};
        this.models.forEach(m => { this._models[m.name] = m; });
        this._interceptors = new component_1.InterceptorCollection(this.interceptors).get(component_1.Interceptor.Controller);
        return this;
    }
    /** Digest a parsed message, finding the correct Controller */
    digest(connection, message) {
        let cnt = this.controllers.find(c => c.section == message.section);
        if (cnt) {
            return this._interceptors.intercept(cnt, [connection, message, this], { type: 'function', callback: (int) => int.call(this) }, { type: 'false', callback: null }, { type: 'any', callback: () => this.makeController(connection, message, cnt) }) || null;
        }
        return null;
    }
    makeController(connection, message, cnt) {
        if (cnt) {
            let cm = new cnt(connection, this.events, this._services, this._models, this._interceptors.get(component_1.Interceptor.Controller));
            this.events.emit(events_1.Event.Module.Digest.Name, cm);
            return cm.digest(message);
        }
        return null;
    }
}
exports.Module = Module;
