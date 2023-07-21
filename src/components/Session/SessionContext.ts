import { createContext, useContext } from 'react';
import { MunchkinClient } from '../../protocol/munchkin/MunchkinClient';
import { MunchkinServer } from '../../protocol/munchkin/MunchkinServer';
import { MunchkinPlayer, MunchkinPlayerData } from '../../protocol/munchkin/MunchkinModels';

export type ClientSessionInstance = {
	type: 'client',
	connection: MunchkinClient,
};

export type ServerSessionInstance = {
	type: 'server',
	connection: MunchkinServer,
};

export type OfflineSessionInstance = {
	type:  'offline',
	connection?: undefined,
};

export type SessionInstance = ClientSessionInstance | ServerSessionInstance;

export interface SessionContextType {
	instance?: SessionInstance;
	players: MunchkinPlayer[];
	createPlayer(player: MunchkinPlayerData): Promise<void>;
	updatePlayer(player: MunchkinPlayer): Promise<void>;
	deletePlayer(playerId: number): Promise<void>;
	startClient(client: MunchkinClient): Promise<void>;
	startServer(): Promise<void>;
	close(): void;
}

export const SessionContext = createContext<SessionContextType>({
	instance: undefined,
	players: [],
	createPlayer: async () => {},
	updatePlayer: async () => {},
	deletePlayer: async () => {},
	startClient: async () => {},
	startServer: async () => {},
	close: () => {},
});

export const useSessionContext = (): SessionContextType => useContext(SessionContext);
