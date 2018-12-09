import { Decorator } from './decorator';
import { MethodDecoration } from './method.decorator';
export declare type AccessorDecoration = MethodDecoration;
export declare class AccessorDecorator extends Decorator {
    function(name: string): AccessorDecoration;
    static target(name: string, ...args: any[]): AccessorDecoration;
    static decore(...args: any[]): AccessorDecoration;
}
