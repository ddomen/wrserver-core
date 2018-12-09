import { Decorator } from './decorator';
/** Decorator for parameter | function(@Dec()a: string){} | */
export declare type ParameterDecoration = (fn: Function, key: string | symbol, index: number) => void;
export declare class ParameterDecorator extends Decorator {
    function(name: string): ParameterDecoration;
    static target(name: string, ...args: any[]): ParameterDecoration;
    static decore(...args: any[]): ParameterDecoration;
}
