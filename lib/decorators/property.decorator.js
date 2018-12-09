"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decorator_1 = require("./decorator");
class PropertyDecorator extends decorator_1.Decorator {
    function(name) { return super.function(name); }
    static target(name, ...args) { return super.target(name, ...args); }
    static decore(...args) { return super.decore(...args); }
}
exports.PropertyDecorator = PropertyDecorator;
