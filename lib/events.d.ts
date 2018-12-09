/** Event for Emitter Request handling */
export declare namespace Event {
    interface Event {
    }
    /** Event for Emitter Request handling - Generic Unknown Event */
    interface Any extends Event {
        [key: string]: any;
    }
    /** Event for Emitter Request handling - Event from Models */
    interface Model extends Event {
        table: string;
    }
    namespace Model {
        /** Event for Emitter Request handling - Event from Models - Set [See DataService.set] */
        interface Set extends Model {
            data: any;
        }
        /** Event for Emitter Request handling - Event from Models - Delete [See DataService.delete]  */
        interface Delete extends Model {
            where: any;
        }
        /** Event for Emitter Request handling - Event from Models - Update [See DataService.update]  */
        interface Update extends Set, Delete {
        }
        /** Event for Emitter Request handling - Event from Models - Get [See DataService.get]  */
        interface Get extends Delete {
            order: any;
            mapAs: any;
        }
        /** Event for Emitter Request handling - Event from Models - First [See DataService.first]  */
        interface First extends Get {
        }
        /** Event for Emitter Request handling - Event from Models - Save [See DataService.save]  */
        interface Save extends Model {
            table: string;
        }
        /** Event for Emitter Request handling - Event from Models - Table [See DataService.apply] */
        interface Table extends Save {
            model: string;
        }
    }
    /** Event form Emitter Request handling - Event emitted from WRS */
    namespace Server {
        /** Event form Emitter Request handling - Event emitted from WRS - Receiving Http Request with Url */
        interface Url extends Event {
            url: string;
        }
        /** Event form Emitter Request handling - Event emitted from Controller - Digesting messag [See Controller.digest] */
        interface Controller extends Event {
            controller: any;
        }
        /** Event form Emitter Request handling - Event emitted from Module - Digesting messag [See ModuleBase.digest] */
        interface Module extends Event {
            target: string;
            sector: string;
            option: string;
            id: number;
            data: any;
            connection: any;
        }
        /** Event form Emitter Request handling - Event emitted from WRS - Broadcasting a message */
        interface Broadcast extends Event {
            class: string;
            data: any;
            filter: any;
        }
    }
    /** Event from Emitter request handling - Event emitted from Mail Service */
    interface Email extends Event {
        to: string | string[];
        subject: string;
        text: string;
        html?: boolean;
        from?: string;
        isFile?: boolean;
    }
    interface IncompleteEmail extends Event {
        to?: string | string[];
        subject: string;
        text: string;
        html?: boolean;
        from?: string;
        isFile?: boolean;
    }
}
