import { Class } from '../wrserver';
import { Decorator } from './decorator';
/** Decorator for classes  | @Dec()class{} |*/
export declare type ClassDecoration<T extends object = any> = (constructor: Class) => T;
export declare class ClassDecorator extends Decorator {
    function(name: string): ClassDecoration;
    static target(name: string, ...args: any[]): ClassDecoration;
    static decore(...args: any[]): ClassDecoration;
}
