import {
	AmmoUsedEvent,
	ArenasItemDeselectedEvent,
	ArenasItemSelectedEvent,
	BannerCollectedEvent,
	CharacterSelectedEvent,
	GameStateChangedEvent,
	GibraltarShieldAbsorbedEvent,
	GrenadeThrownEvent,
	InitEvent,
	InventoryDropEvent,
	InventoryPickUpEvent,
	InventoryUseEvent,
	MatchSetupEvent,
	MatchStateEndEvent,
	ObserverSwitchedEvent,
	PlayerAbilityUsedEvent,
	PlayerAssistEvent,
	PlayerConnectedEvent,
	PlayerDamagedEvent,
	PlayerDownedEvent,
	PlayerKilledEvent,
	PlayerRespawnTeamEvent,
	PlayerReviveEvent,
	PlayerStatChangedEvent,
	RingFinishedClosingEvent,
	RingStartClosingEvent,
	SquadEliminatedEvent,
	UnknownEvent,
	WeaponSwitchedEvent,
	WraithPortalEvent,
	ZiplineUsedEvent
} from './apexevents';
import { ApexLegendsState } from './apexlegends';

export interface Events {
	data: (data: ApexLegendsState) => void;
	init: (event: InitEvent) => void;
	gameStateChanged: (event: GameStateChangedEvent) => void;
	matchSetup: (event: MatchSetupEvent) => void;
	playerConnected: (event: PlayerConnectedEvent) => void;
	characterSelected: (event: CharacterSelectedEvent) => void;
	observerSwitched: (event: ObserverSwitchedEvent) => void;
	playerAbilityUsed: (event: PlayerAbilityUsedEvent) => void;
	weaponSwitched: (event: WeaponSwitchedEvent) => void;
	playerDamaged: (event: PlayerDamagedEvent) => void;
	playerStatChanged: (event: PlayerStatChangedEvent) => void;
	inventoryDrop: (event: InventoryDropEvent) => void;
	grenadeThrown: (event: GrenadeThrownEvent) => void;
	inventoryPickUp: (event: InventoryPickUpEvent) => void;
	inventoryUse: (event: InventoryUseEvent) => void;
	matchStateEnd: (event: MatchStateEndEvent) => void;
	playerAssist: (event: PlayerAssistEvent) => void;
	playerKilled: (event: PlayerKilledEvent) => void;
	squadEliminated: (event: SquadEliminatedEvent) => void;
	wraithPortal: (event: WraithPortalEvent) => void;
	ziplineUsed: (event: ZiplineUsedEvent) => void;

	gibraltarShieldAbsorbed: (event: GibraltarShieldAbsorbedEvent) => void;
	bannerCollected: (event: BannerCollectedEvent) => void;
	playerRevive: (event: PlayerReviveEvent) => void;
	playerRespawnTeam: (event: PlayerRespawnTeamEvent) => void;
	playerDowned: (event: PlayerDownedEvent) => void;
	ammoUsed: (event: AmmoUsedEvent) => void;
	arenasItemSelected: (event: ArenasItemSelectedEvent) => void;
	arenasItemDeselected: (event: ArenasItemDeselectedEvent) => void;
	ringStartClosing: (event: RingStartClosingEvent) => void;
	ringFinishedClosing: (event: RingFinishedClosingEvent) => void;

	unknown: (event: UnknownEvent) => void;
	newListener: <K extends keyof Events>(eventName: K, listener: Events[K]) => void;
	removeListener: <K extends keyof Events>(eventName: K, listener: Events[K]) => void;
}
