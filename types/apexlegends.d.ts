import { PlayerExtension, TeamExtension } from './interfaces';

type GameState = 'WaitingForPlayers' | 'PickLoadout' | 'Prematch' | 'Playing' | 'WinnerDetermined';

type Vector = {
	x: number;
	y: number;
	z: number;
};

type DamageLog = {
	targetName: string;
	distance: number;
	damage: number;
	weapon: string;
	timestamp: number;
};

export type PlayerRaw = {
	pos: Vector;
	angles: Vector;
	name: string;
	teamId: number;
	currentHealth: number;
	maxHealth: number;
	shieldHealth: number;
	shieldMaxHealth: number;
	nucleusHash: string;
	hardwareName: string;
	teamName: string;
	squadIndex: number;
	character: string;
	skin: string;
};

type InteractionLog = {
	playerName: string;
	timestamp: number;
};

type ItemLog = {
	item: string;
	timestamp: number;
};

type AbilityLog = {
	ability: string;
	timestamp: number;
};

type PlayerPlaying = {
	type: 'playing';
	pos: Vector;
	angles: Vector;
	character: string;
	skin: string;
	hp: number;
	maxHp: number;
	shield: number;
	maxShield: number;
	assists: number;
	kills: number;
	distanceRun: number;
	killLog: InteractionLog[];
	deathLog: InteractionLog[];
	downLog: InteractionLog[];
	reviveLog: InteractionLog[];
	respawnLog: InteractionLog[];
	damageLog: DamageLog[];
	usedItemLog: ItemLog[];
	knockdowns: number;
	currentWeapons: string[];
	abilitiesUsedLog: AbilityLog[];
	thrownGrenadesLog: ItemLog[];
	ammoStash: { [ammoType: string]: number };
};

type PlayerWaiting = {
	type: 'waiting';
	character?: string;
	skin?: string;
};

type Player = {
	name: string;
	extension?: PlayerExtension;
} & (PlayerPlaying | PlayerWaiting);

interface Squad {
	name: string;
	eliminatedTimesCount: number;
	players: Player[];
	teamExtension?: TeamExtension;
}

interface RingData {
	stage: number;
	center: Vector;
	radius: number;
	timestamp: number;
}

interface Settings {
	map: string;
	playlistName: string;
	playlistDesc: string;
	aimAssist: boolean;
	anonymousMode: boolean;
}

interface ServerData {
	serverId: string;
	datacenterTimestamp: number;
	datacenterCategory: string;
	datacenterName: string;
}

export interface ApexLegendsState {
	gameState: GameState;
	currentTimestamp: number;
	gameVersion?: string;
	apiVersion?: {
		majorNum: number;
		minorNum: number;
		buildStamp: number;
		revision: string;
	};
	currentRing?: RingData;
	nextRing?: RingData;
	settings?: Settings;
	server?: ServerData;
	observedPlayer?: string;
	squads: Squad[];
	currentLeaderboardSquadNames: string[];
	sortedSquads: Squad[];
	players: Player[];
	winnerSquadName?: string;
}
