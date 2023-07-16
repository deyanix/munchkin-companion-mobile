import { createContext, useContext } from 'react';
import { MunchkinClient } from '../../protocol/munchkin/client';
import { MunchkinServer } from '../../protocol/munchkin/server';
import { MunchkinGame, MunchkinPlayer, MunchkinPlayerData } from '../../protocol/munchkin/game';
import { MunchkinDiscoveryClient } from '../../protocol/munchkin/discoveryClient';

export type ClientSessionInstance = {
	type: 'client',
	client: MunchkinClient,
	discoveryClient: MunchkinDiscoveryClient,
};

export type ServerSessionInstance = {
	type: 'server',
	server: MunchkinServer,
};

export type OfflineSessionInstance = {
	type:  'offline',
	game: MunchkinGame,
};

export type SessionInstance = ClientSessionInstance | ServerSessionInstance | OfflineSessionInstance;

export interface SessionContextType {
	instance?: SessionInstance;
	players: MunchkinPlayer[];
	createPlayer(player: MunchkinPlayerData): void;
	updatePlayer(player: MunchkinPlayer): void;
	startClient(): Promise<void>;
	startServer(): Promise<void>;
}

export const SessionContext = createContext<SessionContextType>({
	instance: undefined,
	players: [],
	createPlayer: () => {},
	updatePlayer: () => {},
	startClient: async () => {},
	startServer: async () => {},
});

export const useSessionContext = (): SessionContextType => useContext(SessionContext);
