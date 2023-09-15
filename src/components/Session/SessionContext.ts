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
	closeGame(): void;
}

export const SessionContext = createContext<SessionContextType>({
	players: [],
	createPlayer: () => {},
	updatePlayer: () => {},
	deletePlayer: () => {},

	startHostGame: () => {},
	startGuestGame: () => {},
	startLocalGame: () => {},
	closeGame: () => {},
});

export const useSessionContext = (): SessionContextType => useContext(SessionContext);
