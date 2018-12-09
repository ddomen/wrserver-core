"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Service Base class [your services should extend this class and have 'Service' at the end of the name] */
class Service {
    constructor(events) {
        this.events = events;
    }
    /** Fire the ready event for initialize the server */
    ready() {
        this.events.fire('service.ready', this, this.constructor.name);
        return this;
    }
}
exports.Service = Service;
