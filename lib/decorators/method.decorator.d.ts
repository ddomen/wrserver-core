import { Instance, Class } from '../wrserver';
import { Decorator } from "./decorator";
export declare type MethodDecoration = (instance: Instance<any> | Class, key: string | symbol, descriptor: PropertyDescriptor) => void | PropertyDescriptor;
export declare class MethodDecorator extends Decorator {
    function(name: string): MethodDecoration;
    static target(name: string, ...args: any[]): MethodDecoration;
    static decore(...args: any[]): MethodDecoration;
}
