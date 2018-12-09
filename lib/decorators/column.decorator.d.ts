import { Constructor } from '../wrserver';
import { ModelBase } from "../models";
import { PropertyDecorator } from "./property.decorator";
export declare type ColumnSource<T = any> = T | (() => T);
export declare type ColumnDecoration = <T extends ModelBase>(Model: T, name: string) => void;
export declare class Column extends PropertyDecorator {
    field(Model: any, name: string): void;
    fieldId(Model: any, name: string): void;
    static decore(type: any, def: any, array?: any): any;
    static Field(type: any, def: any, array?: any): ColumnDecoration;
    static Number(def?: ColumnSource<number>): ColumnDecoration;
    static Boolean(def?: ColumnSource<boolean>): ColumnDecoration;
    static String(def?: ColumnSource<string>): ColumnDecoration;
    static Array(array?: any, def?: ColumnSource<any[]>): ColumnDecoration;
    static Date(def?: ColumnSource<Date>): ColumnDecoration;
    static Model(model: Constructor, def?: ColumnSource): ColumnDecoration;
    static ID(): ColumnDecoration;
}
