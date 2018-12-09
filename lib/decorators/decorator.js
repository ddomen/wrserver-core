"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Decorator {
    constructor(parameters) {
        this.parameters = parameters;
        this.decorators = [];
    }
    apply(...args) { return this.decorators.map(d => typeof d == 'function' ? d.apply(this, args) : d); }
    mixin(derived, base) {
        let exclude = ['length', 'prototype', 'name'];
        base.forEach(b => {
            Object.getOwnPropertyNames(b.prototype).forEach(name => {
                if (name == 'constructor' && derived.constructor) {
                    return;
                }
                derived.prototype[name] = b.prototype[name];
            });
            Object.getOwnPropertyNames(b).filter(x => !exclude.includes(x)).forEach(name => { derived[name] = b[name]; });
        });
        return derived;
    }
    decore(...args) { return null; }
    function(name) {
        let self = this;
        return function (...args) { if (typeof self[name] == 'function') {
            return self[name].apply(self, args.concat(self.apply(...args)));
        } return null; };
    }
    static target(name, ...args) { return new this(args).function(name); }
    static decore(...args) { return this.target('decore', ...args); }
}
exports.Decorator = Decorator;
