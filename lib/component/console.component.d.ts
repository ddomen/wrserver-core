/// <reference types="node" />
import { Console } from 'console';
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
    level(lv?: number): this | number;
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
