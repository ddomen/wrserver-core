"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ModelFormat {
    constructor(name, type, preset, array) {
        this.name = name;
        this.type = type;
        this.preset = preset;
        this.array = ModelFormat.from(array);
    }
    eval(value) {
        let def = typeof this.preset == 'function' ? this.preset.call() : this.preset;
        switch (this.type) {
            case Number:
            case String:
            case Boolean:
                return this.type(value || def);
            case Array:
                return this.array ?
                    Array(...Array(value || def || [])).map(v => this.array.eval(v)) :
                    Array(...Array(value || def || []));
            default:
                return new this.type(value || def);
        }
    }
    static from(format) {
        if (!format) {
            return null;
        }
        else if (ModelFormat.is(format)) {
            return format;
        }
        else if (Array.isArray(format)) {
            return format.length >= 3 ?
                new ModelFormat(format[0], format[1], format[2], format[3]) :
                null;
        }
        else {
            return new ModelFormat(format.name, format.type, format.preset, format.array);
        }
    }
    static is(value) { return value instanceof ModelFormat; }
}
exports.ModelFormat = ModelFormat;
class ModelBase {
    constructor(data = {}) {
        ModelBase.addModel((new.target));
        this.parse(data);
    }
    get class() { return this.constructor; }
    toJSON() {
        let columns = this.class.Columns;
        if (columns) {
            let res = {};
            for (let c of this.class.Columns) {
                res[c.name] = this[c.name];
            }
            return res;
        }
        return this;
    }
    parse(data = {}) {
        if (this.class.Columns) {
            for (let c of this.class.Columns) {
                if (!c) {
                    continue;
                }
                else if (typeof c == 'string') {
                    this[c] = data[c];
                }
                else if (Array.isArray(c)) {
                    this[c[0]] = this.evaluate(data[c[0]], ModelFormat.from([c[1], c[2], c[3]]));
                }
                else if (typeof c == 'object') {
                    this[c.name] = this.evaluate(data[c.name], ModelFormat.from(c));
                }
                else if (ModelFormat.is(c)) {
                    this[c.name] = this.evaluate(data[c.name], c);
                }
            }
        }
        return this;
    }
    evaluate(value, format) { return format.eval(value); }
    sendable() { return Object.assign({}, this); }
    static Field(name, type, def, array) { return ModelFormat.from([name, type, def, array]); }
    static Number(name, def = 0) { return ModelBase.Field(name, Number, def); }
    static Boolean(name, def = false) { return ModelBase.Field(name, Boolean, def); }
    static String(name, def = '') { return ModelBase.Field(name, String, def); }
    static Array(name, array, def = () => []) { return ModelBase.Field(name, Array, def, array); }
    static Date(name, def = () => new Date) { return ModelBase.Field(name, Date, def); }
    static Model(model, def = () => new model, name = '') { return ModelBase.Field(name, model, def); }
    static ID(Model) { Model.ID = Number(Model.ID) || 1; return Model.Number('id', () => Model.ID++); }
    static getByName(name) {
        if (!name) {
            return null;
        }
        let n = name.toLocaleLowerCase();
        n = n[0].toUpperCase() + n.substr(1) + 'Model';
        return this.MODELS[n] || null;
    }
    static addModel(model) {
        if (model && typeof model.name == 'string' && model.name && !this.MODELS[model.name]) {
            this.MODELS[model.name] = model;
        }
        return this;
    }
}
ModelBase.ArrayNumber = new ModelFormat(null, Number, 0);
ModelBase.ArrayBoolean = new ModelFormat(null, Boolean, false);
ModelBase.ArrayString = new ModelFormat(null, String, '');
ModelBase.ArrayDate = new ModelFormat(null, Date, () => new Date);
ModelBase.MODELS = {};
exports.ModelBase = ModelBase;
function Model(constructor) { ModelBase.addModel(constructor); }
exports.Model = Model;
