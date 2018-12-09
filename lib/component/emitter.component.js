"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Emitter {
    constructor() {
        this.handlers = {};
        this.responders = {};
        this.composers = [];
        this.fired = [];
    }
    get htypes() { return Object.keys(this.handlers); }
    emit(type, data = {}, name = null, like = true) {
        let event = new EventModel(type, name, data);
        this.fired.push(event);
        if (this.handlers[type]) {
            let hs = this.handlers[type];
            if (name != null) {
                hs = hs.filter(h => h.name == name);
            }
            hs.forEach(h => h.call(event));
            this.handlers[type] = this.handlers[type].filter(h => !h.elasped);
        }
        if (like) {
            let htypes = this.htypes.filter(t => !!t.match(type) && t != type);
            htypes.forEach(ht => {
                let hs = this.handlers[ht];
                hs = hs.filter(h => h.like);
                if (name != null) {
                    hs = hs.filter(h => h.name == name);
                }
                hs.forEach(h => h.call(event));
                this.handlers[ht] = this.handlers[ht].filter(h => !h.elasped);
            });
        }
        return this;
    }
    fire(type, data = {}, name = null, like = true) {
        if (!this.fired.find(ev => ev.type == type && (!name || ev.name == name))) {
            this.emit(type, data, name, like);
        }
        else if (like) {
            let htypes = this.htypes.filter(t => !!t.match(type));
            htypes.forEach(ht => { if (!this.fired.find(ev => ev.type == ht && (!name || ev.name == name))) {
                this.emit(type, data, name, like);
            } });
        }
        return this;
    }
    on(type, callback, name = null, times, like = false) {
        if (!this.handlers[type]) {
            this.handlers[type] = [];
        }
        this.handlers[type].push(new HandlerModel(name, callback, times, like));
        return this;
    }
    off(type, name = null) {
        if (this.handlers[type]) {
            this.handlers[type] = this.handlers[type].filter(h => h.name != name);
        }
        return this;
    }
    once(type, callback, name = null) {
        if (!this.handlers[type]) {
            this.handlers[type] = [];
        }
        let hs = new HandlerModel(name, callback, 1), ev = this.fired.filter(e => e.type == type && (!name || e.name == name))[0];
        if (ev) {
            hs.call(ev);
        }
        else {
            this.handlers[type].push(hs);
        }
        return this;
    }
    onces(types, callback, name = null) {
        if (Array.isArray(types) && types.length) {
            types.length == 1 ? this.once(types.shift(), callback, name) : this.once(types.shift(), () => { this.onces(types, callback, name); }, name);
        }
        return this;
    }
    ons(types, callback, name = null, times) {
        types.forEach(t => { this.on(t, callback, name, times); });
        return this;
    }
    like(type, callback, name = null, times) { return this.on(type, callback, name, times, true); }
    request(type, event) {
        if (event && typeof event.type == 'string' && event.type && this.responders[type]) {
            return this.responders[type].respond(event);
        }
        return null;
    }
    respond(type, response, callable = true, name = null, times) {
        if (!this.responders[type]) {
            this.responders[type] = new ResponderModel(name, response, callable, times);
        }
        return this;
    }
    compose(composer, callback, callable = true, name = null, times) {
        this.composers.push(new ComposerModel(name, composer, callback, times, callable));
        return this;
    }
    decompose(composer, data = {}, name = null) {
        let comps = this.composers.filter(c => c.compose(composer));
        if (comps.length) {
            let event = new EventModel('ComposerEvent', name, Object.assign({}, data, { composer }));
            comps.forEach(c => c.call(event));
            this.composers = this.composers.filter(c => !!c.elasped);
        }
        return this;
    }
    hasFired(type, name = null) { return this.fired.filter(ev => ev.type == type && (!name || ev.name == name)).length; }
}
exports.Emitter = Emitter;
class EventModel {
    constructor(type, name = null, data = {}) {
        this.type = type;
        this.name = name;
        this.data = data;
    }
}
exports.EventModel = EventModel;
class Handler {
    constructor(name, times = Infinity) {
        this.name = name;
        this.times = times;
        this.count = 0;
    }
    get elasped() { return this.count >= this.times; }
}
class HandlerModel extends Handler {
    constructor(name, callback, times = Infinity, like = false) {
        super(name, times);
        this.callback = callback;
        this.like = like;
    }
    call(event) { if (typeof this.callback == 'function' && !this.elasped) {
        this.callback.call(null, event);
        this.count++;
    } return this; }
}
exports.HandlerModel = HandlerModel;
class ResponderModel extends Handler {
    constructor(name, response, callable = true, times = Infinity) {
        super(name, times);
        this.response = response;
        this.callable = callable;
    }
    respond(event) {
        if (!this.elasped) {
            if (this.callable && typeof this.response == 'function') {
                return this.response.call(null, event);
            }
            else {
                return this.response;
            }
        }
        return;
    }
}
exports.ResponderModel = ResponderModel;
class ComposerModel extends Handler {
    constructor(name, composer, callback, times = Infinity, callable = true) {
        super(name, times);
        this.composer = composer;
        this.callback = callback;
        this.callable = callable;
    }
    call(event) { if (typeof this.callback == 'function' && !this.elasped) {
        this.callback.call(null, event);
        this.count++;
    } return this; }
    decompose(target, composer = this.composer) {
        switch (typeof composer) {
            case 'function': return this.callable ? composer.call(null, target) : composer;
            case 'object':
                if (Array.isArray(composer)) {
                    return composer.map(x => this.decompose(target, x));
                }
                return composer;
            default: return composer;
        }
    }
    compose(target, composer = this.composer) {
        let decomposed = this.decompose(target, composer);
        if (Array.isArray(decomposed)) {
            return decomposed.some(d => this.compose(target, d));
        }
        switch (typeof target) {
            case 'object':
                if (Array.isArray(target)) {
                    return target.some(c => this.compose(c));
                }
                else {
                    return decomposed == target;
                }
            case 'function': return target.call(null, decomposed) == decomposed;
            default: return decomposed == target;
        }
    }
}
exports.ComposerModel = ComposerModel;
