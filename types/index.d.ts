import { ApexLegendsEvent } from './apexevents';
import { ApexLegendsState } from './apexlegends';
import { Events } from './events';
import { PlayerExtension, TeamExtension } from './interfaces';
type EventNames = keyof Events;
interface EventDescriptor {
    listener: Events[EventNames];
    once: boolean;
}
declare class ApexLegendsGSI {
    private descriptors;
    private maxListeners;
    teams: TeamExtension[];
    players: PlayerExtension[];
    last?: ApexLegendsState;
    current?: ApexLegendsState;
    constructor();
    eventNames: () => (keyof Events)[];
    getMaxListeners: () => number;
    listenerCount: (eventName: EventNames) => number;
    listeners: (eventName: EventNames) => (((data: ApexLegendsState) => void) | ((event: import("./apexevents").InitEvent) => void) | ((event: import("./apexevents").GameStateChangedEvent) => void) | ((event: import("./apexevents").MatchSetupEvent) => void) | ((event: import("./apexevents").PlayerConnectedEvent) => void) | ((event: import("./apexevents").CharacterSelectedEvent) => void) | ((event: import("./apexevents").ObserverSwitchedEvent) => void) | ((event: import("./apexevents").PlayerAbilityUsedEvent) => void) | ((event: import("./apexevents").WeaponSwitchedEvent) => void) | ((event: import("./apexevents").PlayerDamagedEvent) => void) | ((event: import("./apexevents").PlayerStatChangedEvent) => void) | ((event: import("./apexevents").InventoryDropEvent) => void) | ((event: import("./apexevents").GrenadeThrownEvent) => void) | ((event: import("./apexevents").InventoryPickUpEvent) => void) | ((event: import("./apexevents").InventoryUseEvent) => void) | ((event: import("./apexevents").MatchStateEndEvent) => void) | ((event: import("./apexevents").PlayerAssistEvent) => void) | ((event: import("./apexevents").PlayerKilledEvent) => void) | ((event: import("./apexevents").SquadEliminatedEvent) => void) | ((event: import("./apexevents").WraithPortalEvent) => void) | ((event: import("./apexevents").ZiplineUsedEvent) => void) | ((event: import("./apexevents").GibraltarShieldAbsorbedEvent) => void) | ((event: import("./apexevents").BannerCollectedEvent) => void) | ((event: import("./apexevents").PlayerReviveEvent) => void) | ((event: import("./apexevents").PlayerRespawnTeamEvent) => void) | ((event: import("./apexevents").PlayerDownedEvent) => void) | ((event: import("./apexevents").AmmoUsedEvent) => void) | ((event: import("./apexevents").ArenasItemSelectedEvent) => void) | ((event: import("./apexevents").ArenasItemDeselectedEvent) => void) | ((event: import("./apexevents").RingStartClosingEvent) => void) | ((event: import("./apexevents").RingFinishedClosingEvent) => void) | ((event: import("./apexevents").UnknownEvent) => void) | (<K extends keyof Events>(eventName: K, listener: Events[K]) => void) | (<K_1 extends keyof Events>(eventName: K_1, listener: Events[K_1]) => void))[];
    removeListener: <K extends keyof Events>(eventName: K, listener: Events[K]) => this;
    off: <K extends keyof Events>(eventName: K, listener: Events[K]) => this;
    addListener: <K extends keyof Events>(eventName: K, listener: Events[K]) => this;
    on: <K extends keyof Events>(eventName: K, listener: Events[K]) => this;
    once: <K extends keyof Events>(eventName: K, listener: Events[K]) => this;
    prependListener: <K extends keyof Events>(eventName: K, listener: Events[K]) => this;
    emit: (eventName: EventNames, arg?: any, arg2?: any) => boolean;
    prependOnceListener: <K extends keyof Events>(eventName: K, listener: Events[K]) => this;
    removeAllListeners: (eventName: EventNames) => this;
    setMaxListeners: (n: number) => this;
    rawListeners: (eventName: EventNames) => EventDescriptor[];
    resetData: () => void;
    digest: (rawEvent: ApexLegendsEvent) => ApexLegendsState | null;
}
export { ApexLegendsGSI };
