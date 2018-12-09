import { Constructor, ClassOf } from '../wrserver';
export declare type ModelBaseExtender<T extends ModelBase> = T;
export declare type ModelType<T extends ModelBase = any> = ClassOf<T>;
export declare class ModelFormat {
    name: string;
    type: any;
    preset: any;
    array: ModelFormat;
    constructor(name: string, type: any, preset: any, array?: any);
    eval(value: any): any;
    static from(format: any): ModelFormat;
    static is(value: any): boolean;
}
export declare abstract class ModelBase {
    constructor(data?: any);
    protected readonly class: any;
    protected toJSON(): any;
    protected parse(data?: any): this;
    protected evaluate(value: any, format: ModelFormat): any;
    sendable(): ModelBase;
    static Field(name: string, type: Function, def: any, array?: any): ModelFormat;
    static Number(name: string, def?: (() => number) | number): ModelFormat;
    static Boolean(name: string, def?: (() => boolean) | boolean): ModelFormat;
    static String(name: string, def?: (() => string) | string): ModelFormat;
    static Array(name: string, array?: any, def?: (() => any[]) | any[]): ModelFormat;
    static Date(name: string, def?: (() => Date) | Date): ModelFormat;
    static Model(model: any, def?: (() => any) | any, name?: string): ModelFormat;
    static ID(Model: any): any;
    static getByName(name: string): Constructor;
    static addModel(model: Constructor): typeof ModelBase;
    protected static ArrayNumber: ModelFormat;
    protected static ArrayBoolean: ModelFormat;
    protected static ArrayString: ModelFormat;
    protected static ArrayDate: ModelFormat;
    protected static Table: string;
    private static MODELS;
}
export declare function Model(constructor: Constructor): void;
