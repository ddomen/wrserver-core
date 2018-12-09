"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const PATH = __importStar(require("path"));
const FS = __importStar(require("fs"));
const console_1 = require("console");
/** Usefull console logger with file output */
class WRSConsole extends console_1.Console {
    constructor(grade = 'UNK', directory = process.cwd()) {
        super(process.stdout, process.stderr);
        this.grade = grade;
        this.directory = directory;
        this.currentLevel = 0;
        this.path = PATH.join(this.directory, 'logs');
    }
    formatNumber(n = 0, digit = 2) {
        let nn = n.toString();
        while (nn.length < digit) {
            nn = '0' + nn;
        }
        return nn;
    }
    date() { let d = new Date(); return this.formatNumber(d.getHours()) + ':' + this.formatNumber(d.getMinutes()) + ':' + this.formatNumber(d.getSeconds()); }
    field(...str) { return str.map(s => '[' + s + ']').join(''); }
    row(...str) { return str.map(s => s + '\n').join(''); }
    tab(...str) { return str.map(s => s + '\t').join(''); }
    meta(mode) { return this.field(this.grade, mode.toUpperCase(), this.date(), this.stackTrace()); }
    saveLog(level, mode, ...args) {
        try {
            if (!FS.existsSync(this.path)) {
                FS.mkdirSync(this.path);
            }
            FS.writeFileSync(PATH.join(this.path, mode + '.json'), this.stringify({ date: new Date(), grade: this.grade, trace: this.stackTrace(), silenced: level < this.currentLevel, data: args, level, mode }) + ',\n', { flag: 'a' });
        }
        catch (e) { }
        return this;
    }
    stackTrace() {
        let e = (new Error().stack || '').split('\n');
        e.shift();
        return PATH.relative(this.directory, ((e.find(x => !x.match('WRSConsole')) || '').match(/\((.*)\)/) || [])[1]);
    }
    stamp(stamper, mode, level = 0, ...args) {
        if (typeof this[stamper] != 'function') {
            return this;
        }
        if (typeof level != 'number') {
            return this.stamp(stamper, mode, 0, level, ...args);
        }
        this.saveLog(level, mode, ...args);
        if (this.currentLevel <= level) {
            return super[(stamper == 'trace' ? 'log' : stamper)](this.meta(mode), ...args);
        }
        return this;
    }
    /** Set the level of the output of the console. Greater is, lesser will be on the console (does not influence file output) */
    level(lv) { if (lv == undefined) {
        return this.currentLevel;
    } this.currentLevel = Number(lv) || 0; return this; }
    /** Stringify a circular object in Json pattern */
    stringify(obj) {
        let cache = [];
        return JSON.stringify(obj, (key, value) => {
            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    try {
                        return JSON.parse(JSON.stringify(value));
                    }
                    catch (error) {
                        return;
                    }
                }
                cache.push(value);
            }
            return value;
        });
    }
    log(...args) { return this.stamp('log', 'log', ...args); }
    info(...args) { return this.stamp('info', 'info', ...args); }
    debug(...args) { return this.stamp('debug', 'debug', ...args); }
    table(...args) { return this.stamp('table', 'table', ...args); }
    error(...args) { return this.stamp('error', 'error', ...args); }
    warn(...args) { return this.stamp('warn', 'warn', ...args); }
    trace(...args) { return this.stamp('trace', 'trace', ...args); }
    node(...args) { return this.stamp('log', 'node', ...args); }
    service(...args) { return this.stamp('log', 'service', ...args); }
    model(...args) { return this.stamp('log', 'model', ...args); }
    module(...args) { return this.stamp('log', 'module', ...args); }
    controller(...args) { return this.stamp('log', 'controller', ...args); }
    connection(...args) { return this.stamp('log', 'connection', ...args); }
}
exports.WRSConsole = WRSConsole;
