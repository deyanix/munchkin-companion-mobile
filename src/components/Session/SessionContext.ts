import { createContext, useContext } from 'react';
import { MunchkinPlayer, MunchkinPlayerData } from '../../modules/GameModule/GameModule';

export interface SessionContextType {
	players: MunchkinPlayer[];
	createPlayer(player: MunchkinPlayerData): Promise<void>;
	updatePlayer(player: MunchkinPlayer): Promise<void>;
	deletePlayer(playerId: number): Promise<void>;
}

export const SessionContext = createContext<SessionContextType>({
	players: [],
	createPlayer: async () => {},
	updatePlayer: async () => {},
	deletePlayer: async () => {},
});

export const useSessionContext = (): SessionContextType => useContext(SessionContext);
