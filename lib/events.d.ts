/// <reference types="express-serve-static-core" />
import { Connection, IConnectionIncomingMessage, IConnectionIncomingParsed, IConnectionOutcome } from "./component";
import { Service } from "./service";
import { request as WSRequest } from "websocket";
import { IBroadcastOutcome } from "./wrserver";
import { Module } from "./module";
import { Controller, Page } from "./controller";
/** Event for Emitter Request handling */
export interface Event {
}
export declare namespace Event {
    namespace Any {
        const Name: string;
        interface Type extends Event {
            [key: string]: any;
        }
    }
    /** Connection shared Events  */
    namespace Connection {
        /** Fires when connection rise up */
        namespace Rise {
            const Name: string;
            type Type = Connection;
        }
        /** Fires when connection drop down */
        namespace Drop {
            const Name: string;
            type Type = Connection;
        }
        /** Fires when connection closes (before drop) */
        namespace Close {
            const Name: string;
            type Type = Connection;
        }
        /** Fires when connection get an error */
        namespace Error {
            const Name: string;
            type Type = Error;
        }
        /** Fires when connection receives a ping */
        namespace Ping {
            const Name: string;
            type Type = Connection;
        }
        /** Fires before connection send a pong */
        namespace Pong {
            const Name: string;
            type Type = Connection;
        }
        /** Fires when connection receives a message (yet not parsed) */
        namespace Message {
            const Name: string;
            type Type = IConnectionIncomingMessage;
        }
        /** Fires when connection receives a parsed message */
        namespace ParsedMessage {
            const Name: string;
            type Type = IConnectionIncomingParsed;
        }
        /** Fires when connection receives a parsed message (Alias for ParsedMessage) */
        namespace Digest {
            const Name: string;
            type Type = Module;
        }
        /** Fires when connection send a message */
        namespace Send {
            const Name: string;
            type Type = IConnectionOutcome;
        }
    }
    /** Service shared Events */
    namespace Service {
        /** Fires when the Service ready method is called */
        namespace Ready {
            const Name: string;
            type Type = Service;
        }
        /** Fires when all Services ready method are called */
        namespace AllReady {
            const Name: string;
            type Type = null;
        }
    }
    /** Server shared Events */
    namespace Server {
        /** Fires when connection send a message in broadcast mode */
        namespace Broadcast {
            const Name: string;
            type Type = IBroadcastOutcome;
        }
        /** Fires when the server is fully ready */
        namespace Ready {
            const Name: string;
            type Type = null;
        }
        /** Fires when receiving a GET HTTP request */
        namespace Url {
            const Name: string;
            type Type = Express.Request;
        }
        /** Fires when receiving any method but GET HTTP request */
        namespace BadMethod {
            const Name: string;
            type Type = Express.Request;
        }
        /** Firse when server get error on HTTP request (status code 500) */
        namespace Error {
            const Name: string;
            type Type = Error;
        }
    }
    /** Websocket shared Events */
    namespace Websocket {
        /** Firse when a websocket connection request has been rejected */
        namespace Reject {
            const Name: string;
            type Type = WSRequest;
        }
        /** Firse when a websocket connection request has been accepted */
        namespace Accept {
            const Name: string;
            type Type = Connection;
        }
    }
    /** Module shared Events */
    namespace Module {
        /** Fires when a module digest successfully a message */
        namespace Digest {
            const Name: string;
            type Type = Controller;
        }
    }
    /** Controller shared Events */
    namespace Controller {
        namespace Digest {
            const Name: string;
            type Type = Page;
        }
    }
}
