import { Constructor } from '../wrserver';
import { ModelBase } from "../models";
import { PropertyDecorator } from "./property.decorator";
export declare type ColumnSource<T = any> = T | (() => T);
export declare type ColumnDecoration = <T extends ModelBase>(Model: T, name: string) => void;
/** Define a Column in the TableModel for this type of Model */
export declare class Column extends PropertyDecorator {
    field(Model: any, name: string): void;
    fieldId(Model: any, name: string): void;
    static decore(type: any, def: any, array?: any): any;
    /** Define a Column in the TableModel for this type of Model - Define a Table Column for a Generic Field [See ModelBase.Field] */
    static Field(type: any, def: any, array?: any): ColumnDecoration;
    /** Define a Column in the TableModel for this type of Model -  Define a Table Column for a Numeric Field [See ModelBase.Number] */
    static Number(def?: ColumnSource<number>): ColumnDecoration;
    /** Define a Column in the TableModel for this type of Model -  Define a Table Column for a Boolean Field [See ModelBase.Boolean] */
    static Boolean(def?: ColumnSource<boolean>): ColumnDecoration;
    /** Define a Column in the TableModel for this type of Model -  Define a Table Column for a String Field [See ModelBase.String] */
    static String(def?: ColumnSource<string>): ColumnDecoration;
    /** Define a Column in the TableModel for this type of Model -  Define a Table Column for an Array Field [See ModelBase.Array] */
    static Array(array?: any, def?: ColumnSource<any[]>): ColumnDecoration;
    /** Define a Column in the TableModel for this type of Model -  Define a Table Column for a Date Field [See ModelBase.Date] */
    static Date(def?: ColumnSource<Date>): ColumnDecoration;
    /** Define a Column in the TableModel for this type of Model -  Define a Table Column for a Model Field [See ModelBase.Model] */
    static Model(model: Constructor, def?: ColumnSource): ColumnDecoration;
    /** Define a Column in the TableModel for this type of Model -  Define a Table Column for an ID autoincrement Field [See ModelBase.ID] */
    static ID(): ColumnDecoration;
}
