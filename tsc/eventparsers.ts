import {
	AmmoUsedEvent,
	ApexLegendsEvent,
	ApexLegendsEventType,
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
import { ApexLegendsState, Player, PlayerPlaying, PlayerRaw, Squad } from './apexlegends';
import { calculateDistance, displayUnexpectedDataInfo } from './utils';

const ensureSquadExists = (state: ApexLegendsState, squadName: string): Squad => {
	const squad = state.squads.find(x => x.name === squadName);
	if (squad) {
		return squad;
	}

	const newSquad = {
		players: [],
		name: squadName,
		eliminatedTimesCount: 0
	};

	state.squads.push(newSquad);
	return newSquad;
};

const ensurePlayerExists = (squad: Squad, playerName: string): Player => {
	const player = squad.players.find(x => x.name === playerName);
	if (player) {
		return player;
	}

	const newPlayer = {
		type: 'waiting' as const,
		name: playerName
	};
	squad.players.push(newPlayer);

	return newPlayer;
};

const constructPlayer = (squad: Squad, rawPlayer: PlayerRaw) => {
	squad.players = squad.players.filter(x => x.name !== rawPlayer.name);
	squad.players.push({
		type: 'playing',
		...rawPlayer,
		hp: rawPlayer.currentHealth,
		maxHp: rawPlayer.maxHealth,
		shield: rawPlayer.shieldHealth,
		maxShield: rawPlayer.shieldMaxHealth,
		assists: 0,
		kills: 0,
		knockdowns: 0,
		killLog: [],
		deathLog: [],
		damageLog: [],
		currentWeapons: [],
		usedItemLog: [],
		abilitiesUsedLog: [],
		thrownGrenadesLog: [],
		reviveLog: [],
		downLog: [],
		ammoStash: {},
		respawnLog: [],
		distanceRun: 0
	});
};

const updatePlayerSquad = (currentSquad: Squad, player: Player, rawPlayer: PlayerRaw, state: ApexLegendsState) => {
	if (currentSquad.name === rawPlayer.teamName) return;
	const newSquad = ensureSquadExists(state, rawPlayer.teamName);
	currentSquad.players = currentSquad.players.filter(x => x.name !== player.name);
	newSquad.players.push(player);
};

const updatePlayerData = (squad: Squad, rawPlayer: PlayerRaw, state: ApexLegendsState) => {
	const player = squad.players.find(x => x.name === rawPlayer.name);
	if (!player) return;
	if (squad.name !== rawPlayer.teamName) {
		updatePlayerSquad(squad, player, rawPlayer, state);
	}
	if (player.type !== 'playing') return;
	player.distanceRun += calculateDistance(player.pos, rawPlayer.pos);
	player.angles = rawPlayer.angles;
	player.pos = rawPlayer.pos;
	player.hp = rawPlayer.currentHealth;
	player.maxHp = rawPlayer.maxHealth;
	player.shield = rawPlayer.shieldHealth;
	player.maxShield = rawPlayer.shieldMaxHealth;
	player.skin = rawPlayer.skin;
	player.character = rawPlayer.character;
};

const ensureRawPlayerExists = (state: ApexLegendsState, rawPlayer: PlayerRaw) => {
	const squad = ensureSquadExists(state, rawPlayer.teamName);
	const player = ensurePlayerExists(squad, rawPlayer.name);
	if (player.type === 'waiting') {
		constructPlayer(squad, rawPlayer);
	} else {
		updatePlayerData(squad, rawPlayer, state);
	}

	return squad.players.find(x => x.name === rawPlayer.name);
};

const ensurePlayerHasWeapon = (player: PlayerPlaying, weapon: string) => {
	const currentWeapon = player.currentWeapons.find(x => x === weapon);
	if (!currentWeapon) {
		player.currentWeapons.push(weapon);
	}
};

const stubEventParser = (_event: ApexLegendsEvent, _state: ApexLegendsState) => {};

export const parseCommonEventData = (event: ApexLegendsEvent, state: ApexLegendsState) => {
	const castTimestamp = Number(event.timestamp);
	state.currentTimestamp = castTimestamp || state.currentTimestamp;
};

const parseInit = (event: InitEvent, state: ApexLegendsState) => {
	if (event.gameVersion) {
		state.gameVersion = event.gameVersion;
	}
	if (event.apiVersion) {
		state.apiVersion = event.apiVersion;
	}
};

const parseGameStateChanged = (event: GameStateChangedEvent, state: ApexLegendsState) => {
	state.gameState = event.state;
};

const parseMatchSetup = (event: MatchSetupEvent, state: ApexLegendsState) => {
	state.server = {
		serverId: event.serverId,
		datacenterCategory: event.datacenter.category,
		datacenterName: event.datacenter.name,
		datacenterTimestamp: Number(event.datacenter.timestamp) || 0
	};

	state.settings = {
		map: event.map,
		playlistDesc: event.playlistDesc,
		playlistName: event.playlistName,
		aimAssist: event.aimAssist,
		anonymousMode: event.anonymousMode
	};
};

const parseCharacterSelected = (event: CharacterSelectedEvent, state: ApexLegendsState) => {
	ensureRawPlayerExists(state, event.player);
};

const parseObserverSwitched = (event: ObserverSwitchedEvent, state: ApexLegendsState) => {
	ensureRawPlayerExists(state, event.observer);
	ensureRawPlayerExists(state, event.target);
	state.observedPlayer = event.target.name;
};

const parsePlayerAbilityUsed = (event: PlayerAbilityUsedEvent, state: ApexLegendsState) => {
	const player = ensureRawPlayerExists(state, event.player);
	if (player && player.type === 'playing') {
		player.abilitiesUsedLog.push({
			timestamp: state.currentTimestamp,
			ability: event.linkedEntity
		});
	}
};

const parseWeaponSwitchedPlayer = (event: WeaponSwitchedEvent, state: ApexLegendsState) => {
	const player = ensureRawPlayerExists(state, event.player);
	if (player && player.type === 'playing') {
		ensurePlayerHasWeapon(player, event.newWeapon);
	}
};

const parsePlayerDamaged = (event: PlayerDamagedEvent, state: ApexLegendsState) => {
	const attacker = ensureRawPlayerExists(state, event.attacker);
	if (attacker && attacker.type === 'playing') {
		attacker.damageLog.push({
			targetName: event.victim.name,
			damage: Number(event.damageInflicted) || 0,
			weapon: event.weapon,
			distance: calculateDistance(event.attacker.pos, event.victim.pos),
			timestamp: state.currentTimestamp
		});
	}
	ensureRawPlayerExists(state, event.victim);
};

const parsePlayerStatChanged = (event: PlayerStatChangedEvent, state: ApexLegendsState) => {
	const player = ensureRawPlayerExists(state, event.player);
	if (player && player.type === 'playing') {
		switch (event.statName) {
			case 'knockdowns':
				player.knockdowns = Number(event.newValue);
				break;
			case 'kills':
				player.kills = Number(event.newValue);
				break;
			case 'assists':
				player.assists = Number(event.newValue);
				break;
			default:
				displayUnexpectedDataInfo('player stat name', event.statName, event);
		}
	}
};

const parseInventoryDrop = (event: InventoryDropEvent, state: ApexLegendsState) => {
	const player = ensureRawPlayerExists(state, event.player);
	if (player && player.type === 'playing') {
		let changed = false;
		player.currentWeapons.filter(x => {
			if (!changed && x === event.item) {
				changed = true;
				return false;
			}
			return true;
		});
	}
};

const parseGrenadeThrown = (event: GrenadeThrownEvent, state: ApexLegendsState) => {
	const player = ensureRawPlayerExists(state, event.player);
	if (player && player.type === 'playing') {
		player.thrownGrenadesLog.push({
			timestamp: state.currentTimestamp,
			item: event.linkedEntity
		});
	}
};

const parseInventoryPickup = (event: InventoryPickUpEvent, state: ApexLegendsState) => {
	const player = ensureRawPlayerExists(state, event.player);
	if (player && player.type === 'playing') {
		player.currentWeapons.push(event.item);
	}
};

const parseInventoryUse = (event: InventoryUseEvent, state: ApexLegendsState) => {
	const player = ensureRawPlayerExists(state, event.player);
	if (player && player.type === 'playing') {
		player.usedItemLog.push({
			item: event.item,
			timestamp: state.currentTimestamp
		});
	}
};

const parseMatchStateEnd = (event: MatchStateEndEvent, state: ApexLegendsState) => {
	state.gameState = event.state;
	const winner = event.winners[0];
	if (winner) {
		state.winnerSquadName = winner.teamName;
	}
};

const parsePlayerAssist = (event: PlayerAssistEvent, state: ApexLegendsState) => {
	ensureRawPlayerExists(state, event.assistant);
	ensureRawPlayerExists(state, event.victim);
};

const parsePlayerKilled = (event: PlayerKilledEvent, state: ApexLegendsState) => {
	const attacker = ensureRawPlayerExists(state, event.attacker);
	const victim = ensureRawPlayerExists(state, event.victim);
	if (attacker && attacker.type === 'playing' && victim) {
		attacker.killLog.push({
			playerName: victim.name,
			timestamp: state.currentTimestamp
		});
	}

	if (victim && victim.type === 'playing' && attacker) {
		victim.deathLog.push({
			playerName: attacker.name,
			timestamp: state.currentTimestamp
		});
	}
};

const parseSquadEliminated = (event: SquadEliminatedEvent, state: ApexLegendsState) => {
	if (event.players.length === 0) return;
	event.players.map(x => ensureRawPlayerExists(state, x));
	const player = event.players.find(x => x);
	if (!player) return;
	const squad = ensureSquadExists(state, player.teamName);
	if (squad) {
		squad.eliminatedTimesCount += 1;
	}
};

const parseAmmoUsed = (event: AmmoUsedEvent, state: ApexLegendsState) => {
	const player = ensureRawPlayerExists(state, event.player);
	if (player && player.type === 'playing') {
		if (!(event.ammoType in player.ammoStash)) {
			player.ammoStash[event.ammoType] = 0;
		}
		player.ammoStash[event.ammoType] = event.newAmmoCount;
	}
};

const parsePlayerDowned = (event: PlayerDownedEvent, state: ApexLegendsState) => {
	const attacker = ensureRawPlayerExists(state, event.attacker);
	const victim = ensureRawPlayerExists(state, event.victim);
	if (attacker && attacker.type === 'playing' && victim) {
		attacker.downLog.push({ playerName: victim.name, timestamp: state.currentTimestamp });
	}
};

const parsePlayerRevive = (event: PlayerReviveEvent, state: ApexLegendsState) => {
	const player = ensureRawPlayerExists(state, event.player);
	if (player && player.type === 'playing') {
		player.reviveLog.push({ playerName: event.revived, timestamp: state.currentTimestamp });
	}
};

const parsePlayerRespawnTeam = (event: PlayerRespawnTeamEvent, state: ApexLegendsState) => {
	const player = ensureRawPlayerExists(state, event.player);
	if (player && player.type === 'playing') {
		player.respawnLog.push({ playerName: event.respawned, timestamp: state.currentTimestamp });
	}
};

const parseRingStartClosing = (event: RingStartClosingEvent, state: ApexLegendsState) => {
	state.currentRing = {
		stage: event.stage - 1,
		radius: event.currentRadius,
		timestamp: state.currentTimestamp,
		center: state.currentRing ? state.currentRing.center : event.center
	};

	state.nextRing = {
		stage: event.stage,
		radius: event.endRadius,
		timestamp: state.currentTimestamp + event.shrinkDuration,
		center: event.center
	};
};

const parseRingFinishedClosing = (event: RingFinishedClosingEvent, state: ApexLegendsState) => {
	state.currentRing = {
		stage: event.stage,
		radius: event.currentRadius,
		center: event.center,
		timestamp: state.currentTimestamp
	};
	state.nextRing = undefined;
};

const parseWraithPortal = (event: WraithPortalEvent, state: ApexLegendsState) => {
	ensureRawPlayerExists(state, event.player);
};

const parseZiplineUsed = (event: ZiplineUsedEvent, state: ApexLegendsState) => {
	ensureRawPlayerExists(state, event.player);
};

const parseGibraltarShieldAbsorbed = (event: GibraltarShieldAbsorbedEvent, state: ApexLegendsState) => {
	ensureRawPlayerExists(state, event.attacker);
	ensureRawPlayerExists(state, event.victim);
};

const parseBannerCollected = (event: BannerCollectedEvent, state: ApexLegendsState) => {
	ensureRawPlayerExists(state, event.player);
	ensureRawPlayerExists(state, event.collected);
};

const parseUnknownEvent = (event: UnknownEvent, state: ApexLegendsState) => {
	displayUnexpectedDataInfo('event', event.category, event);
};

export const parsers: { [key in ApexLegendsEventType]: (event: any, state: ApexLegendsState) => void } = {
	init: parseInit,
	gameStateChanged: parseGameStateChanged,
	matchSetup: parseMatchSetup,
	characterSelected: parseCharacterSelected,
	observerSwitched: parseObserverSwitched,
	playerAbilityUsed: parsePlayerAbilityUsed,
	weaponSwitched: parseWeaponSwitchedPlayer,
	playerDamaged: parsePlayerDamaged,
	playerStatChanged: parsePlayerStatChanged,
	inventoryDrop: parseInventoryDrop,
	grenadeThrown: parseGrenadeThrown,
	inventoryPickUp: parseInventoryPickup,
	inventoryUse: parseInventoryUse,
	matchStateEnd: parseMatchStateEnd,
	playerAssist: parsePlayerAssist,
	playerKilled: parsePlayerKilled,
	squadEliminated: parseSquadEliminated,
	wraithPortal: parseWraithPortal,
	ziplineUsed: parseZiplineUsed,
	unknown: parseUnknownEvent,
	ammoUsed: parseAmmoUsed,
	playerDowned: parsePlayerDowned,
	playerRevive: parsePlayerRevive,
	playerRespawnTeam: parsePlayerRespawnTeam,
	gibraltarShieldAbsorbed: parseGibraltarShieldAbsorbed,
	bannerCollected: parseBannerCollected,
	ringStartClosing: parseRingStartClosing,
	ringFinishedClosing: parseRingFinishedClosing,

	playerConnected: stubEventParser,
	arenasItemSelected: stubEventParser,
	arenasItemDeselected: stubEventParser
};
