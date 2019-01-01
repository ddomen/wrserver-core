"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const property_decorator_1 = require("./property.decorator");
/** Define a Column in the TableModel for this type of Model */
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
            constr.Columns.push(models_1.ModelBase.ID(constr));
        }
    }
    static decore(type, def, array) { return this.Field(type, def, array); }
    /** Define a Column in the TableModel for this type of Model - Define a Table Column for a Generic Field [See ModelBase.Field] */
    static Field(type, def, array) { return this.target('field', type, def, array); }
    /** Define a Column in the TableModel for this type of Model -  Define a Table Column for a Numeric Field [See ModelBase.Number] */
    static Number(def = 0) { return this.target('field', Number, def); }
    /** Define a Column in the TableModel for this type of Model -  Define a Table Column for a Boolean Field [See ModelBase.Boolean] */
    static Boolean(def = false) { return this.target('field', Boolean, def); }
    /** Define a Column in the TableModel for this type of Model -  Define a Table Column for a String Field [See ModelBase.String] */
    static String(def = '') { return this.target('field', String, def); }
    /** Define a Column in the TableModel for this type of Model -  Define a Table Column for an Array Field [See ModelBase.Array] */
    static Array(array, def = () => []) { return this.target('field', Array, def, array); }
    /** Define a Column in the TableModel for this type of Model -  Define a Table Column for a Date Field [See ModelBase.Date] */
    static Date(def = () => new Date) { return this.target('field', Date, def); }
    /** Define a Column in the TableModel for this type of Model -  Define a Table Column for a Model Field [See ModelBase.Model] */
    static Model(model, def = () => new model) { return this.target('field', model, def); }
    /** Define a Column in the TableModel for this type of Model -  Define a Table Column for an ID autoincrement Field [See ModelBase.ID] */
    static ID() { return this.target('fieldId'); }
}
exports.Column = Column;
