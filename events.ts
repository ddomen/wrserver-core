/** Event for Emitter Request handling */
export namespace Event{
    /** Event for Emitter Request handling - Generic Typed Event */
    export interface Event { type: string }
    /** Event for Emitter Request handling - Generic Unknown Event */
    export interface Any extends Event { [key: string]: any }

    /** Event for Emitter Request handling - Event from Models */
    export interface Model extends Event { table: string }
    export namespace Model{
        /** Event for Emitter Request handling - Event from Models - Set [See DataService.set] */
        export interface Set extends Model { data: any }
        /** Event for Emitter Request handling - Event from Models - Delete [See DataService.delete]  */
        export interface Delete extends Model { where: any }
        /** Event for Emitter Request handling - Event from Models - Update [See DataService.update]  */
        export interface Update extends Set, Delete{ }
        /** Event for Emitter Request handling - Event from Models - Get [See DataService.get]  */
        export interface Get extends Delete { order: any, mapAs: any }
        /** Event for Emitter Request handling - Event from Models - First [See DataService.first]  */
        export interface First extends Get { }
        /** Event for Emitter Request handling - Event from Models - Save [See DataService.save]  */
        export interface Save extends Model { table: string }
        /** Event for Emitter Request handling - Event from Models - Table [See DataService.apply] */
        export interface Table extends Save { model: string }
    }

    /** Event form Emitter Request handling - Event emitted from WRS */
    export namespace Server{
        /** Event form Emitter Request handling - Event emitted from WRS - Receiving Http Request with Url */
        export interface Url extends Event { url: string }
        /** Event form Emitter Request handling - Event emitted from Controller - Digesting messag [See Controller.digest] */
        export interface Controller extends Event { controller: any }
        /** Event form Emitter Request handling - Event emitted from Module - Digesting messag [See ModuleBase.digest] */
        export interface Module extends Event { target: string, sector: string, option: string, id: number, data: any, connection: any }
        /** Event form Emitter Request handling - Event emitted from WRS - Broadcasting a message */
        export interface Broadcast extends Event { class: string, data: any, filter: any  }
    }

    /** Event from Emitter request handling - Event emitted from Mail Service */
    export interface Email { to: string | string[], subject: string, text: string, html?: boolean, from?: string, isFile?: boolean }
    export interface IncompleteEmail { to?: string | string[], subject: string, text: string, html?: boolean, from?: string, isFile?: boolean }
}

