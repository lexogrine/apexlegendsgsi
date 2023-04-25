import { ApexLegendsState, Player, Squad, Vector } from './apexlegends';
import { PlayerExtension, TeamExtension } from './interfaces';
export declare const displayUnexpectedDataInfo: (parsed: string, found: string, event: object) => void;
export declare const calculateDistance: (v1: Vector, v2: Vector) => number;
export declare const createPlayerCopy: (player: Player) => Player;
export declare const createSquadCopy: (squad: Squad) => Squad;
export declare const createNewState: () => ApexLegendsState;
export declare const createStateCopy: (state: ApexLegendsState | undefined) => ApexLegendsState;
export declare const calculateLeaderboards: (newState: ApexLegendsState) => {
	leaderboardNames: string[];
	sortedSquads: Squad[];
};
export declare const fillExtensions: (squads: Squad[], teams: TeamExtension[], players: PlayerExtension[]) => void;
