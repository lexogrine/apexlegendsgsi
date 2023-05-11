import { GameState, PlayerRaw, Vector } from './apexlegends';

type Category =
	| 'characterSelected'
	| 'gameStateChanged'
	| 'grenadeThrown'
	| 'init'
	| 'inventoryDrop'
	| 'inventoryPickUp'
	| 'inventoryUse'
	| 'matchSetup'
	| 'matchStateEnd'
	| 'observerSwitched'
	| 'playerAbilityUsed'
	| 'playerAssist'
	| 'playerConnected'
	| 'playerConnected'
	| 'playerDamaged'
	| 'playerKilled'
	| 'playerStatChanged'
	| 'squadEliminated'
	| 'weaponSwitched'
	| 'wraithPortal'
	| 'ziplineUsed';

type BaseEvent = {
	category: string;
	timestamp: string;
};

type InitEvent = BaseEvent & {
	type: 'init';
	gameVersion: string;
	apiVersion?: {
		majorNum: number;
		minorNum: number;
		buildStamp: number;
		revision: string;
	};
};

type GameStateChangedEvent = BaseEvent & {
	type: 'gameStateChanged';
	state: GameState;
};

type MatchSetupEvent = BaseEvent & {
	type: 'matchSetup';
	map: string;
	playlistName: string;
	playlistDesc: string;
	datacenter: {
		timestamp: string;
		category: string;
		name: string;
	};
	aimAssist: boolean;
	anonymousMode: boolean;
	serverId: string;
};

type RingStartClosingEvent = BaseEvent & {
	type: 'ringStartClosing';
	stage: number;
	center: Vector;
	currentRadius: number;
	endRadius: number;
	shrinkDuration: number;
};

type RingFinishedClosingEvent = BaseEvent & {
	type: 'ringFinishedClosing';
	stage: number;
	center: Vector;
	currentRadius: number;
	shrinkDuration: number;
};

type PlayerConnectedEvent = BaseEvent & {
	type: 'playerConnected';
	player: PlayerRaw;
};

type CharacterSelectedEvent = BaseEvent & {
	type: 'characterSelected';
	player: PlayerRaw;
};

type ObserverSwitchedEvent = BaseEvent & {
	type: 'observerSwitched';
	observer: PlayerRaw;
	target: PlayerRaw;
	targetTeam: PlayerRaw[];
};

type PlayerAbilityUsedEvent = BaseEvent & {
	type: 'playerAbilityUsed';
	player: PlayerRaw;
	linkedEntity: string;
};

type WeaponSwitchedEvent = BaseEvent & {
	type: 'weaponSwitched';
	player: PlayerRaw;
	oldWeapon: string;
	newWeapon: string;
};

type PlayerDamagedEvent = BaseEvent & {
	type: 'playerDamaged';
	attacker: PlayerRaw;
	victim: PlayerRaw;
	weapon: string;
	damageInflicted: string;
};

type PlayerStatChangedEvent = BaseEvent & {
	type: 'playerStatChanged';
	player: PlayerRaw;
	statName: string;
	newValue: string;
};

type InventoryDropEvent = BaseEvent & {
	type: 'inventoryDrop';
	player: PlayerRaw;
	item: string;
	quantity: number;
	extraData: any;
};

type GrenadeThrownEvent = BaseEvent & {
	type: 'grenadeThrown';
	player: PlayerRaw;
	linkedEntity: string;
};

type InventoryPickUpEvent = BaseEvent & {
	type: 'inventoryPickUp';
	player: PlayerRaw;
	item: string;
	quantity: number;
};

type InventoryUseEvent = BaseEvent & {
	type: 'inventoryUse';
	player: PlayerRaw;
	item: string;
	quantity: number;
};

type MatchStateEndEvent = BaseEvent & {
	type: 'matchStateEnd';
	state: GameState;
	winners: PlayerRaw[];
};

type PlayerAssistEvent = BaseEvent & {
	type: 'playerAssist';
	assistant: PlayerRaw;
	victim: PlayerRaw;
	weapon: string;
};

type PlayerKilledEvent = BaseEvent & {
	type: 'playerKilled';
	attacker: PlayerRaw;
	victim: PlayerRaw;
	awardedTo: PlayerRaw;
	weapon: string;
};

type SquadEliminatedEvent = BaseEvent & {
	type: 'squadEliminated';
	players: PlayerRaw[];
};

type WraithPortalEvent = BaseEvent & {
	type: 'wraithPortal';
	player: PlayerRaw;
};

type ZiplineUsedEvent = BaseEvent & {
	type: 'ziplineUsed';
	player: PlayerRaw;
	linkedEntity: string;
};

type GibraltarShieldAbsorbedEvent = BaseEvent & {
	type: 'gibraltarShieldAbsorbed';
	attacker: PlayerRaw;
	victim: PlayerRaw;
	damageInflicted: number;
};

type BannerCollectedEvent = BaseEvent & {
	type: 'bannerCollected';
	player: PlayerRaw;
	collected: PlayerRaw;
};

type PlayerReviveEvent = BaseEvent & {
	type: 'playerRevive';
	player: PlayerRaw;
	revived: PlayerRaw;
};

type PlayerRespawnTeamEvent = BaseEvent & {
	type: 'playerRespawnTeam';
	player: PlayerRaw;
	respawned: string;
};

type PlayerDownedEvent = BaseEvent & {
	type: 'playerDowned';
	attacker: PlayerRaw;
	victim: PlayerRaw;
	weapon: string;
};

type AmmoUsedEvent = BaseEvent & {
	type: 'ammoUsed';
	player: PlayerRaw;
	ammoType: string;
	amountUsed: number;
	oldAmmoCount: number;
	newAmmoCount: number;
};

type ArenasItemSelectedEvent = BaseEvent & {
	type: 'arenasItemSelected';
	player: PlayerRaw;
	item: string;
	quantity: number;
};

type ArenasItemDeselectedEvent = BaseEvent & {
	type: 'arenasItemDeselected';
	player: PlayerRaw;
	item: string;
	quantity: number;
};

type UnknownEvent = BaseEvent & {
	type: 'unknown';
	category: string;
	data: any;
};

type ApexLegendsEvent =
	| InitEvent
	| GameStateChangedEvent
	| MatchSetupEvent
	| PlayerConnectedEvent
	| CharacterSelectedEvent
	| ObserverSwitchedEvent
	| PlayerAbilityUsedEvent
	| WeaponSwitchedEvent
	| PlayerDamagedEvent
	| PlayerStatChangedEvent
	| InventoryDropEvent
	| GrenadeThrownEvent
	| InventoryPickUpEvent
	| InventoryUseEvent
	| MatchStateEndEvent
	| PlayerAssistEvent
	| PlayerKilledEvent
	| SquadEliminatedEvent
	| WraithPortalEvent
	| ZiplineUsedEvent
	| AmmoUsedEvent
	| PlayerDownedEvent
	| PlayerRespawnTeamEvent
	| PlayerReviveEvent
	| BannerCollectedEvent
	| GibraltarShieldAbsorbedEvent
	| RingStartClosingEvent
	| RingFinishedClosingEvent
	| ArenasItemSelectedEvent
	| ArenasItemDeselectedEvent
	| UnknownEvent;

type ApexLegendsEventType = ApexLegendsEvent['type'];
