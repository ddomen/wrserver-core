"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const property_decorator_1 = require("./property.decorator");
class Column extends property_decorator_1.PropertyDecorator {
    field(Model, name) {
        let constr = Model.constructor;
        if (Array.isArray(constr.Columns)) {
            constr.Columns.push(constr.Field(name, this.parameters[0], this.parameters[1], this.parameters[2]));
        }
    }
    fieldId(Model, name) {
        let constr = Model.constructor;
        if (Array.isArray(constr.Columns)) {
            constr.Columns.push(constr.ID(constr));
        }
    }
    static decore(type, def, array) { return this.Field(type, def, array); }
    static Field(type, def, array) { return this.target('field', type, def, array); }
    static Number(def = 0) { return this.target('field', Number, def); }
    static Boolean(def = false) { return this.target('field', Boolean, def); }
    static String(def = '') { return this.target('field', String, def); }
    static Array(array, def = () => []) { return this.target('field', Array, def, array); }
    static Date(def = () => new Date) { return this.target('field', Date, def); }
    static Model(model, def = () => new model) { return this.target('field', model, def); }
    static ID() { return this.target('fieldId'); }
}
exports.Column = Column;
