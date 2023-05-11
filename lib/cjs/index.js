"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApexLegendsGSI = void 0;
const eventparsers_js_1 = require("./eventparsers.js");
const utils_js_1 = require("./utils.js");
class ApexLegendsGSI {
    constructor() {
        this.eventNames = () => {
            const listeners = this.descriptors.entries();
            const nonEmptyEvents = [];
            for (const entry of listeners) {
                if (entry[1] && entry[1].length > 0) {
                    nonEmptyEvents.push(entry[0]);
                }
            }
            return nonEmptyEvents;
        };
        this.getMaxListeners = () => this.maxListeners;
        this.listenerCount = (eventName) => {
            const listeners = this.listeners(eventName);
            return listeners.length;
        };
        this.listeners = (eventName) => {
            const descriptors = this.descriptors.get(eventName) || [];
            return descriptors.map(descriptor => descriptor.listener);
        };
        this.removeListener = (eventName, listener) => {
            return this.off(eventName, listener);
        };
        this.off = (eventName, listener) => {
            const descriptors = this.descriptors.get(eventName) || [];
            this.descriptors.set(eventName, descriptors.filter(descriptor => descriptor.listener !== listener));
            this.emit('removeListener', eventName, listener);
            return this;
        };
        this.addListener = (eventName, listener) => {
            return this.on(eventName, listener);
        };
        this.on = (eventName, listener) => {
            this.emit('newListener', eventName, listener);
            const listOfListeners = [...(this.descriptors.get(eventName) || [])];
            listOfListeners.push({ listener, once: false });
            this.descriptors.set(eventName, listOfListeners);
            return this;
        };
        this.once = (eventName, listener) => {
            const listOfListeners = [...(this.descriptors.get(eventName) || [])];
            listOfListeners.push({ listener, once: true });
            this.descriptors.set(eventName, listOfListeners);
            return this;
        };
        this.prependListener = (eventName, listener) => {
            const listOfListeners = [...(this.descriptors.get(eventName) || [])];
            listOfListeners.unshift({ listener, once: false });
            this.descriptors.set(eventName, listOfListeners);
            return this;
        };
        this.emit = (eventName, arg, arg2) => {
            const listeners = this.descriptors.get(eventName);
            if (!listeners || listeners.length === 0)
                return false;
            listeners.forEach(listener => {
                if (listener.once) {
                    this.descriptors.set(eventName, listeners.filter(listenerInArray => listenerInArray !== listener));
                }
                listener.listener(arg, arg2);
            });
            return true;
        };
        this.prependOnceListener = (eventName, listener) => {
            const listOfListeners = [...(this.descriptors.get(eventName) || [])];
            listOfListeners.unshift({ listener, once: true });
            this.descriptors.set(eventName, listOfListeners);
            return this;
        };
        this.removeAllListeners = (eventName) => {
            this.descriptors.set(eventName, []);
            return this;
        };
        this.setMaxListeners = (n) => {
            this.maxListeners = n;
            return this;
        };
        this.rawListeners = (eventName) => {
            return this.descriptors.get(eventName) || [];
        };
        this.resetData = () => {
            this.current = undefined;
            this.last = undefined;
        };
        this.digest = (rawEvent) => {
            if (!rawEvent)
                return null;
            let event = rawEvent;
            if (!(rawEvent.category in eventparsers_js_1.parsers)) {
                event = {
                    type: 'unknown',
                    category: rawEvent.type,
                    timestamp: rawEvent.timestamp,
                    data: rawEvent
                };
            }
            else {
                event = {
                    ...rawEvent,
                    type: rawEvent.category
                };
            }
            const newState = (0, utils_js_1.createStateCopy)(this.current);
            (0, eventparsers_js_1.parseCommonEventData)(event, newState);
            eventparsers_js_1.parsers[event.type](event, newState);
            const { leaderboardNames, sortedSquads } = (0, utils_js_1.calculateLeaderboards)(newState);
            newState.currentLeaderboardSquadNames = leaderboardNames;
            newState.sortedSquads = sortedSquads;
            newState.players = newState.squads.reduce((p, x) => p.concat(x.players), []);
            (0, utils_js_1.fillExtensions)(newState.squads, this.teams, this.players);
            this.last = this.current;
            this.current = newState;
            this.emit('data', newState);
            this.emit(event.type, event);
            return newState;
        };
        this.descriptors = new Map();
        this.teams = [];
        this.maxListeners = 10;
        this.players = [];
    }
}
exports.ApexLegendsGSI = ApexLegendsGSI;
