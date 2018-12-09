/// <reference types="node" />
import { Console } from 'console';
/** Usefull console logger with file output */
export declare class WRSConsole extends Console {
    protected grade: string;
    protected directory: string;
    currentLevel: number;
    protected path: string;
    constructor(grade?: string, directory?: string);
    protected formatNumber(n?: number, digit?: number): string;
    protected date(): string;
    protected field(...str: any[]): string;
    protected row(...str: any[]): string;
    protected tab(...str: any[]): string;
    protected meta(mode: string): string;
    protected saveLog(level: number, mode: string, ...args: any[]): this;
    protected stackTrace(): string;
    protected stamp(stamper: keyof Console, mode: string, level?: number, ...args: any[]): this;
    /** Set the level of the output of the console. Greater is, lesser will be on the console (does not influence file output) */
    level(lv?: number): this | number;
    /** Stringify a circular object in Json pattern */
    stringify(obj: any): string;
    log(...args: any[]): this;
    info(...args: any[]): this;
    debug(...args: any[]): this;
    table(...args: any[]): this;
    error(...args: any[]): this;
    warn(...args: any[]): this;
    trace(...args: any[]): this;
    node(...args: any[]): this;
    service(...args: any[]): this;
    model(...args: any[]): this;
    module(...args: any[]): this;
    controller(...args: any[]): this;
    connection(...args: any[]): this;
}
