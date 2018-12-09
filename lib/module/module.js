"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Module {
    constructor() {
        this.codes = [];
    }
    inject(services) {
        this._services = {};
        this.services.forEach(s => { let serv = services.find(u => u.constructor == s); this._services[s.name] = serv; });
        this._models = {};
        this.models.forEach(m => { this._models[m.name] = m; });
        return this;
    }
    digest(connection, message) {
        let cnt = this.controllers.find(c => c.section == message.section);
        if (cnt) {
            let cm = new cnt(connection, this._services, this._models);
            return cm.digest(message);
        }
        return null;
    }
}
exports.Module = Module;
