"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("../events");
/** Service Base class [your services should extend this class and have 'Service' at the end of the name] */
class Service {
    constructor(events) {
        this.events = events;
        this.dependencies = [];
    }
    init() { return this; }
    /** Fire the ready event for initialize the server */
    ready() {
        this.events.fire(events_1.Event.Service.Ready.Name, this, this.constructor.name);
        return this;
    }
}
exports.Service = Service;
