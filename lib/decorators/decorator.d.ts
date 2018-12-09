import { Class } from '../wrserver';
export declare class Decorator {
    protected parameters: any[];
    protected decorators: any[];
    constructor(parameters: any[]);
    protected apply(...args: any[]): any;
    protected mixin(derived: Class, base: Class[]): any;
    decore(...args: any[]): Decorator;
    function(name: string): any;
    static target(name: string, ...args: any[]): any;
    static decore(...args: any[]): any;
}
