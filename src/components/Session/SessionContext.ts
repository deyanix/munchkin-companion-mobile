import { createContext, useContext } from 'react';
import {
	GuestGameConstructor,
	HostGameConstructor,
	MunchkinPlayer,
	MunchkinPlayerData
} from '../../modules/GameModule/GameModule';

export type SessionControllerType = 'HOST' | 'GUEST' | 'LOCAL'

export interface SessionContextType {
	controllerType?: SessionControllerType;
	players: MunchkinPlayer[];

	createPlayer(player: MunchkinPlayerData): void;
	updatePlayer(player: MunchkinPlayer): void;
	deletePlayer(playerId: number): void;

	startHostGame(data: HostGameConstructor): void;
	startGuestGame(data: GuestGameConstructor): void;
	startLocalGame(): void;
	restoreHostGame(data: HostGameConstructor): void;
	closeGame(): void;

	restoreGame(): Promise<MunchkinPlayer[] | undefined>;
}

export const SessionContext = createContext<SessionContextType>({
	players: [],
	createPlayer: () => {},
	updatePlayer: () => {},
	deletePlayer: () => {},

	startHostGame: () => {},
	startGuestGame: () => {},
	startLocalGame: () => {},
	restoreHostGame: () => {},
	closeGame: () => {},

	restoreGame: async () => undefined,
});

export const useSessionContext = (): SessionContextType => useContext(SessionContext);
