import { ApexLegendsEvent } from './apexevents';
import { ApexLegendsState, Player } from './apexlegends';
import { parseCommonEventData, parsers } from './eventparsers';
import { Events } from './events';
import { PlayerExtension, TeamExtension } from './interfaces';
import { calculateLeaderboards, createStateCopy, fillExtensions } from './utils';

type EventNames = keyof Events;
interface EventDescriptor {
	listener: Events[EventNames];
	once: boolean;
}
class ApexLegendsGSI {
	private descriptors: Map<EventNames, EventDescriptor[]>;
	private maxListeners: number;
	teams: TeamExtension[];
	players: PlayerExtension[];
	last?: ApexLegendsState;
	current?: ApexLegendsState;
	constructor() {
		this.descriptors = new Map();
		this.teams = [];
		this.maxListeners = 10;
		this.players = [];
	}
	eventNames = () => {
		const listeners = this.descriptors.entries();
		const nonEmptyEvents: EventNames[] = [];

		for (const entry of listeners) {
			if (entry[1] && entry[1].length > 0) {
				nonEmptyEvents.push(entry[0]);
			}
		}

		return nonEmptyEvents;
	};
	getMaxListeners = () => this.maxListeners;

	listenerCount = (eventName: EventNames) => {
		const listeners = this.listeners(eventName);
		return listeners.length;
	};

	listeners = (eventName: EventNames) => {
		const descriptors = this.descriptors.get(eventName) || [];
		return descriptors.map(descriptor => descriptor.listener);
	};

	removeListener = <K extends EventNames>(eventName: K, listener: Events[K]) => {
		return this.off(eventName, listener);
	};

	off = <K extends EventNames>(eventName: K, listener: Events[K]) => {
		const descriptors = this.descriptors.get(eventName) || [];

		this.descriptors.set(
			eventName,
			descriptors.filter(descriptor => descriptor.listener !== listener)
		);
		this.emit('removeListener', eventName, listener);
		return this;
	};

	addListener = <K extends EventNames>(eventName: K, listener: Events[K]) => {
		return this.on(eventName, listener);
	};

	on = <K extends EventNames>(eventName: K, listener: Events[K]) => {
		this.emit('newListener', eventName, listener);
		const listOfListeners = [...(this.descriptors.get(eventName) || [])];

		listOfListeners.push({ listener, once: false });
		this.descriptors.set(eventName, listOfListeners);

		return this;
	};

	once = <K extends EventNames>(eventName: K, listener: Events[K]) => {
		const listOfListeners = [...(this.descriptors.get(eventName) || [])];

		listOfListeners.push({ listener, once: true });
		this.descriptors.set(eventName, listOfListeners);

		return this;
	};

	prependListener = <K extends EventNames>(eventName: K, listener: Events[K]) => {
		const listOfListeners = [...(this.descriptors.get(eventName) || [])];

		listOfListeners.unshift({ listener, once: false });
		this.descriptors.set(eventName, listOfListeners);

		return this;
	};

	emit = (eventName: EventNames, arg?: any, arg2?: any) => {
		const listeners = this.descriptors.get(eventName);
		if (!listeners || listeners.length === 0) return false;

		listeners.forEach(listener => {
			if (listener.once) {
				this.descriptors.set(
					eventName,
					listeners.filter(listenerInArray => listenerInArray !== listener)
				);
			}
			(listener.listener as any)(arg, arg2);
		});
		return true;
	};

	prependOnceListener = <K extends EventNames>(eventName: K, listener: Events[K]) => {
		const listOfListeners = [...(this.descriptors.get(eventName) || [])];

		listOfListeners.unshift({ listener, once: true });
		this.descriptors.set(eventName, listOfListeners);

		return this;
	};

	removeAllListeners = (eventName: EventNames) => {
		this.descriptors.set(eventName, []);
		return this;
	};

	setMaxListeners = (n: number) => {
		this.maxListeners = n;
		return this;
	};

	rawListeners = (eventName: EventNames) => {
		return this.descriptors.get(eventName) || [];
	};

	resetData = () => {
		this.current = undefined;
		this.last = undefined;
	};

	digest = (rawEvent: ApexLegendsEvent) => {
		if (!rawEvent) return null;
		let event: ApexLegendsEvent = rawEvent;
		if (!(rawEvent.category in parsers)) {
			event = {
				type: 'unknown',
				category: rawEvent.type,
				timestamp: rawEvent.timestamp,
				data: rawEvent
			};
		} else {
			event = {
				...rawEvent,
				type: rawEvent.category
			} as ApexLegendsEvent;
		}

		const newState = createStateCopy(this.current);

		parseCommonEventData(event, newState);
		parsers[event.type](event, newState);
		const { leaderboardNames, sortedSquads } = calculateLeaderboards(newState);
		newState.currentLeaderboardSquadNames = leaderboardNames;
		newState.sortedSquads = sortedSquads;
		newState.players = newState.squads.reduce((p, x) => p.concat(x.players), [] as Player[]);
		fillExtensions(newState.squads, this.teams, this.players);
		this.last = this.current;
		this.current = newState;

		this.emit('data', newState);
		this.emit(event.type, event);
		return newState;
	};
}

export { ApexLegendsGSI };
