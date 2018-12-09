"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Controller Base class [your controllers should extends this class and have 'Controller' at the end of the name]

 * Every method linked to a page should return a 'ConnectionOutcome'
*/
class Controller {
    constructor(connection, services, models) {
        this.connection = connection;
        this.services = services;
        this.models = models;
    }
    /** Digest a parsed message in an readable response */
    digest(message) {
        if (typeof this[message.page] == 'function') {
            return this[message.page].call(this, message) || Controller.BadDig;
        }
        else if (typeof this.default == 'function') {
            return (this.default.call(this, message) || Controller.BadDig);
        }
        return Controller.NotDig;
    }
    /** Return a readable ok response, with class, and data converted to sendable (if method is present) */
    ok(cls, data, sendableArgs) {
        let sendable = typeof data.sendable == 'function' ? data.sendable(...(sendableArgs || [])) : data;
        return { class: cls, data: sendable };
    }
    /** Return a readable bad response, reporting message with specific code */
    bad(code, message) { return (code && message ? { code, message, bad: true } : code) || Controller.BadDig; }
    /** Retrive a model by its name. Usefull to convert model in desired model type */
    model(name) { return this.models[name.name || name]; }
    /** Retrive a service by its name. Usefull to convert service in desired model type */
    service(name) { return this.services[name.name || name]; }
}
/** Impossible to digest (missing page - linked method) Symbol */
Controller.NotDig = Symbol('NOTDIG');
/** Bad digestion (wrong response of page - linked method) Symbol */
Controller.BadDig = Symbol('BADDIG');
exports.Controller = Controller;
