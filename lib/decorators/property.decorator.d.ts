import { Instance } from '../wrserver';
import { Decorator } from './decorator';
export declare type PropertyDecoration = (instance: Instance<any>, key: string | symbol) => void | any;
export declare class PropertyDecorator extends Decorator {
    function(name: string): PropertyDecoration;
    static target(name: string, ...args: any[]): PropertyDecoration;
    static decore(...args: any[]): PropertyDecoration;
}
