"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Controller {
    constructor(connection, services, models) {
        this.connection = connection;
        this.services = services;
        this.models = models;
    }
    digest(message) {
        if (typeof this[message.page] == 'function') {
            return this[message.page].call(this, message) || Controller.BadDig;
        }
        else if (typeof this.default == 'function') {
            return (this.default.call(this, message) || Controller.BadDig);
        }
        return Controller.NotDig;
    }
    ok(cls, data, sendableArgs) {
        let sendable = typeof data.sendable == 'function' ? data.sendable(...(sendableArgs || [])) : data;
        return { class: cls, data: sendable };
    }
    bad(code, message) { return (code && message ? { code, message, bad: true } : code) || Controller.BadDig; }
    model(name) { return this.models[name.name || name]; }
    service(name) { return this.services[name.name || name]; }
}
Controller.NotDig = Symbol('NOTDIG');
Controller.BadDig = Symbol('BADDIG');
exports.Controller = Controller;
