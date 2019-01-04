"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("../events");
/** Controller Base class [your controllers should extends this class and have 'Controller' at the end of the name]

 * Every method linked to a page should return a 'ConnectionOutcome'
*/
class Controller {
    constructor(connection, events, console, services, models, interceptors) {
        this.connection = connection;
        this.events = events;
        this.console = console;
        this.services = services;
        this.models = models;
        this.interceptors = interceptors;
    }
    /** Digest a parsed message in an readable response */
    digest(message) {
        let page = null;
        let pageStr = message.page.toLowerCase();
        if (typeof this[pageStr] == 'function') {
            page = this[pageStr];
        }
        else if (typeof this.default == 'function') {
            pageStr = 'default';
            page = this.default;
        }
        this.events.emit(events_1.Event.Controller.Digest.Name, page);
        if (page) {
            return this.interceptors.intercept(this.constructor.name.toLowerCase() + '.' + pageStr, [this.connection, message, this], { type: 'function', callback: (int) => int.call(this, page) }, { type: 'null', callback: () => this.callPage(page, message) }, { type: 'false', callback: null }, { type: 'any', callback: () => this.callPage(page, message) }) || Controller.BadDig;
        }
        return Controller.NotDig;
    }
    callPage(page, message) {
        if (page && page.isPage) {
            return page.call(this, message);
        }
        return null;
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
