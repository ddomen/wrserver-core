import { Constructor } from '../wrserver';
export declare type ModelBaseExtender<T extends ModelBase> = T;
export declare type ModelType<T = any> = Constructor<ModelBaseExtender<ModelBase>> & T;
/** Format to build up a Model described by its columns descriptors [See @Column] */
export declare class ModelFormat {
    name: string;
    type: any;
    preset: any;
    array: ModelFormat;
    constructor(name: string, type: any, preset: any, array?: any);
    /** Evaluate initial value from Format descriptor */
    eval(value: any): any;
    /** Convert an object to a ModelFormat */
    static from(format: any): ModelFormat;
    static is(value: any): boolean;
}
/** Model Base class [your models should extends this class and have 'Model' at the end of the name] */
export declare abstract class ModelBase {
    constructor(data?: any);
    /** Return current constructor */
    protected readonly class: any;
    /** Convert the model to a Json writable to and readable from a file */
    protected toJSON(): any;
    /** Parse an object to the current Model descriptor */
    protected parse(data?: any): this;
    /** Evaluate a value from a choosen format [See ModelFormat.eval] */
    protected evaluate(value: any, format: ModelFormat): any;
    /** Convert the Model to a secure sendable object (ex. in this method you can eliminate passwords before send the Model to client) */
    sendable(): ModelBase;
    /** Generic Field Format descriptor (the array? will be evaluated into the current Format)
     *
     * Care that the default value is evaluated once. If it is an object reference every model will inherith the same reference.
     * Use a function returning a new reference to instantiate new object.
    */
    static Field(name: string, type: Function, def: any, array?: any): ModelFormat;
    /** Numeric Format shorthand [See ModelBase.Field] */
    static Number(name: string, def?: (() => number) | number): ModelFormat;
    /** Boolean Format shorthand [See ModelBase.Field] */
    static Boolean(name: string, def?: (() => boolean) | boolean): ModelFormat;
    /** String Format shorthand [See ModelBase.Field] */
    static String(name: string, def?: (() => string) | string): ModelFormat;
    /** Array Format shorthand [See ModelBase.Field] */
    static Array(name: string, array?: any, def?: (() => any[]) | any[]): ModelFormat;
    /** Date Format shorthand [See ModelBase.Field] */
    static Date(name: string, def?: (() => Date) | Date): ModelFormat;
    /** Model Format shorthand, link another Model to the property [See ModelBase.Field] */
    static Model(model: any, def?: (() => any) | any, name?: string): ModelFormat;
    /** ID Format shorthand, generates a static ID member with automatic increment [See ModelBase.Field] */
    static ID(Model: any): any;
    /** Check if a model can be validated */
    protected static checkValidity(model: ModelBase, ...args: any[]): boolean;
    /** Get a Model by its name (exclude model from the name) */
    static getByName<T extends ModelBase = any>(name: string): T;
    /** Add a Model to the static collection */
    static addModel(model: Constructor): typeof ModelBase;
    protected static ArrayNumber: ModelFormat;
    protected static ArrayBoolean: ModelFormat;
    protected static ArrayString: ModelFormat;
    protected static ArrayDate: ModelFormat;
    /** Represent the table name which can be saved on a file */
    protected static Table: string;
    private static MODELS;
}
export declare function Model(constructor: Constructor): void;
