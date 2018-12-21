"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../component");
const events_1 = require("../events");
/** Service Base class [your services should extend this class and have 'Service' at the end of the name] */
class Service {
    constructor(events) {
        this.events = events;
        this.dependencies = [];
        this.interceptors = [];
    }
    /** Inject interceptors to the Service */
    inject(interceptors) {
        let ints = this.interceptors.filter(int => interceptors.check(int.type));
        this.interceptorCollection = new component_1.InterceptorCollection(ints);
        return this;
    }
    /** Initilize the server, just after dependencies resolved.
     *
     * The dependencies are passed to this method by the order defined in the dependencies array of the service
     *
     * For example ```dependencies = [ ServiceType1, ServiceType2 ]``` will trigger ```init(ServiceInstance1, ServiceInstance2)``` */
    init(...dep) { return this; }
    /** Fire the ready event for initialize the server */
    ready() {
        this.events.fire(events_1.Event.Service.Ready.Name, this, this.constructor.name);
        return this;
    }
}
exports.Service = Service;
