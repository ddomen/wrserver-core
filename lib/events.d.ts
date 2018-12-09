export declare namespace Event {
    interface Event {
        type: string;
    }
    interface Any extends Event {
        [key: string]: any;
    }
    interface Model extends Event {
        table: string;
    }
    namespace Model {
        interface Set extends Model {
            data: any;
        }
        interface Delete extends Model {
            where: any;
        }
        interface Update extends Set, Delete {
        }
        interface Get extends Delete {
            order: any;
            mapAs: any;
        }
        interface First extends Get {
        }
        interface Save extends Model {
            table: string;
        }
        interface Table extends Save {
            model: string;
        }
    }
    namespace Server {
        interface Url extends Event {
            url: string;
        }
        interface Controller extends Event {
            controller: any;
        }
        interface Module extends Event {
            target: string;
            sector: string;
            option: string;
            id: number;
            data: any;
            connection: any;
        }
        interface Broadcast extends Event {
            class: string;
            data: any;
            filter: any;
        }
    }
    interface Email {
        to: string | string[];
        subject: string;
        text: string;
        html?: boolean;
        from?: string;
        isFile?: boolean;
    }
    interface IncompleteEmail {
        to?: string | string[];
        subject: string;
        text: string;
        html?: boolean;
        from?: string;
        isFile?: boolean;
    }
}
