/** Event for Emitter Request handling */
export interface Event {}
export namespace Event{
    /** Event for Emitter Request handling - Generic Unknown Event */
    export interface Any extends Event { [key: string]: any }
    
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
}

