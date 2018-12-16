"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Event;
(function (Event) {
    let Any;
    (function (Any) {
        Any.Name = 'event.any';
    })(Any = Event.Any || (Event.Any = {}));
    /** Connection shared Events  */
    let Connection;
    (function (Connection) {
        /** Fires when connection rise up */
        let Rise;
        (function (Rise) {
            Rise.Name = 'connection.rise';
        })(Rise = Connection.Rise || (Connection.Rise = {}));
        /** Fires when connection drop down */
        let Drop;
        (function (Drop) {
            Drop.Name = 'connection.drop';
        })(Drop = Connection.Drop || (Connection.Drop = {}));
        /** Fires when connection closes (before drop) */
        let Close;
        (function (Close) {
            Close.Name = 'connection.close';
        })(Close = Connection.Close || (Connection.Close = {}));
        /** Fires when connection get an error */
        let Error;
        (function (Error) {
            Error.Name = 'connection.error';
        })(Error = Connection.Error || (Connection.Error = {}));
        /** Fires when connection receives a ping */
        let Ping;
        (function (Ping) {
            Ping.Name = 'connection.ping';
        })(Ping = Connection.Ping || (Connection.Ping = {}));
        /** Fires before connection send a pong */
        let Pong;
        (function (Pong) {
            Pong.Name = 'connection.pong';
        })(Pong = Connection.Pong || (Connection.Pong = {}));
        /** Fires when connection receives a message (yet not parsed) */
        let Message;
        (function (Message) {
            Message.Name = 'connection.message';
        })(Message = Connection.Message || (Connection.Message = {}));
        /** Fires when connection receives a parsed message */
        let ParsedMessage;
        (function (ParsedMessage) {
            ParsedMessage.Name = 'connection.parsed';
        })(ParsedMessage = Connection.ParsedMessage || (Connection.ParsedMessage = {}));
        /** Fires when connection receives a parsed message (Alias for ParsedMessage) */
        let Digest;
        (function (Digest) {
            Digest.Name = 'connection.digest';
        })(Digest = Connection.Digest || (Connection.Digest = {}));
        /** Fires when connection send a message */
        let Send;
        (function (Send) {
            Send.Name = 'connection.send';
        })(Send = Connection.Send || (Connection.Send = {}));
    })(Connection = Event.Connection || (Event.Connection = {}));
    /** Service shared Events */
    let Service;
    (function (Service) {
        /** Fires when the Service ready method is called */
        let Ready;
        (function (Ready) {
            Ready.Name = 'service.ready';
        })(Ready = Service.Ready || (Service.Ready = {}));
        /** Fires when all Services ready method are called */
        let AllReady;
        (function (AllReady) {
            AllReady.Name = 'service.all.ready';
        })(AllReady = Service.AllReady || (Service.AllReady = {}));
    })(Service = Event.Service || (Event.Service = {}));
    /** Server shared Events */
    let Server;
    (function (Server) {
        /** Fires when connection send a message in broadcast mode */
        let Broadcast;
        (function (Broadcast) {
            Broadcast.Name = 'server.broadcast';
        })(Broadcast = Server.Broadcast || (Server.Broadcast = {}));
        /** Fires when the server is fully ready */
        let Ready;
        (function (Ready) {
            Ready.Name = 'server.ready';
        })(Ready = Server.Ready || (Server.Ready = {}));
        /** Fires when receiving a GET HTTP request */
        let Url;
        (function (Url) {
            Url.Name = 'server.url';
        })(Url = Server.Url || (Server.Url = {}));
        /** Fires when receiving any method but GET HTTP request */
        let BadMethod;
        (function (BadMethod) {
            BadMethod.Name = 'server.badmethod';
        })(BadMethod = Server.BadMethod || (Server.BadMethod = {}));
        /** Firse when server get error on HTTP request (status code 500) */
        let Error;
        (function (Error) {
            Error.Name = 'server.error';
        })(Error = Server.Error || (Server.Error = {}));
    })(Server = Event.Server || (Event.Server = {}));
    /** Websocket shared Events */
    let Websocket;
    (function (Websocket) {
        /** Firse when a websocket connection request has been rejected */
        let Reject;
        (function (Reject) {
            Reject.Name = 'websocket.reject';
        })(Reject = Websocket.Reject || (Websocket.Reject = {}));
        /** Firse when a websocket connection request has been accepted */
        let Accept;
        (function (Accept) {
            Accept.Name = 'websocket.accept';
        })(Accept = Websocket.Accept || (Websocket.Accept = {}));
    })(Websocket = Event.Websocket || (Event.Websocket = {}));
    /** Module shared Events */
    let Module;
    (function (Module) {
        /** Fires when a module digest successfully a message */
        let Digest;
        (function (Digest) {
            Digest.Name = 'module.digest';
        })(Digest = Module.Digest || (Module.Digest = {}));
    })(Module = Event.Module || (Event.Module = {}));
    /** Controller shared Events */
    let Controller;
    (function (Controller) {
        let Digest;
        (function (Digest) {
            Digest.Name = 'controller.digest';
        })(Digest = Controller.Digest || (Controller.Digest = {}));
    })(Controller = Event.Controller || (Event.Controller = {}));
})(Event = exports.Event || (exports.Event = {}));
