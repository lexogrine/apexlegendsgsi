import { ApexLegendsState, Player, PlayerPlaying, Squad, Vector } from './apexlegends';
import { PlayerExtension, TeamExtension } from './interfaces';

export const displayUnexpectedDataInfo = (parsed: string, found: string, event: object) => {
	console.warn(
		`While parsing ${parsed}, ApexLegends GSI has found unexpected data: ${found}! Submit this message to ApexLegends GSI parser developers to add parsing this data to the package! \n\r${JSON.stringify(
			event,
			undefined,
			2
		)}`
	);
};

export const calculateDistance = (v1: Vector, v2: Vector): number => {
	const dx = v1.x - v2.x;
	const dy = v1.y - v2.y;
	const dz = v1.z - v2.z;

	return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

export const createPlayerCopy = (player: Player): Player => {
	if (player.type === 'waiting') {
		return {
			...player
		};
	}

	return {
		...player,
		pos: { ...player.pos },
		angles: { ...player.angles },
		killLog: player.killLog.map(x => ({ ...x })),
		damageLog: player.damageLog.map(x => ({ ...x })),
		deathLog: player.deathLog.map(x => ({ ...x })),
		usedItemLog: player.usedItemLog.map(x => ({ ...x })),
		abilitiesUsedLog: player.abilitiesUsedLog.map(x => ({ ...x })),
		thrownGrenadesLog: player.thrownGrenadesLog.map(x => ({ ...x })),
		currentWeapons: [...player.currentWeapons]
	};
};

export const createSquadCopy = (squad: Squad): Squad => {
	return {
		...squad,
		players: squad.players.map(x => createPlayerCopy(x))
	};
};

export const createNewState = (): ApexLegendsState => {
	return {
		gameState: 'WaitingForPlayers',
		currentTimestamp: 0,
		squads: [],
		currentLeaderboardSquadNames: [],
		sortedSquads: [],
		players: []
	};
};

export const createStateCopy = (state: ApexLegendsState | undefined): ApexLegendsState => {
	if (!state) return createNewState();
	return {
		...state,
		apiVersion: state.apiVersion
			? {
					...state.apiVersion
			  }
			: undefined,
		settings: state.settings
			? {
					...state.settings
			  }
			: undefined,
		server: state.server
			? {
					...state.server
			  }
			: undefined,
		squads: state.squads.map(x => createSquadCopy(x)),
		currentLeaderboardSquadNames: [...state.currentLeaderboardSquadNames],
		sortedSquads: [],
		players: []
	};
};

export const calculateLeaderboards = (
	newState: ApexLegendsState
): { leaderboardNames: string[]; sortedSquads: Squad[] } => {
	const sorted = newState.squads
		.map(x => ({
			name: x.name,
			kills: x.players.reduce((p, x) => p + (x.type === 'playing' ? (x as PlayerPlaying).kills : 0), 0),
			squad: x
		}))
		.sort((a, b) => b.kills - a.kills);

	return {
		leaderboardNames: sorted.map(x => x.name),
		sortedSquads: sorted.map(x => x.squad)
	};
};

export const fillExtensions = (squads: Squad[], teams: TeamExtension[], players: PlayerExtension[]) => {
	squads.forEach(x => {
		const teamResults: { teamId: string; votes: number }[] = [];

		x.players.forEach(p => {
			const playerExtension = players.find(e => e.steamid === p.name);
			p.extension = playerExtension;

			if (!playerExtension || !playerExtension.teamId) return;

			const targetTeam = teamResults.find(t => t.teamId === playerExtension.id);
			if (targetTeam) {
				targetTeam.votes++;
				return;
			}
			teamResults.push({ teamId: playerExtension.teamId, votes: 1 });
		});
		const probableTeam = teamResults.sort((a, b) => b.votes - a.votes)[0];
		if (!probableTeam || probableTeam.votes === 0) {
			x.teamExtension = undefined;
			return;
		}

		const targetTeam = teams.find(team => team.id === probableTeam.teamId);
		x.teamExtension = targetTeam;
	});
};
