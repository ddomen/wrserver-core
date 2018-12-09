"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Service {
    constructor(events) {
        this.events = events;
    }
    ready() {
        this.events.fire('service.ready', this, this.constructor.name);
        return this;
    }
}
exports.Service = Service;
