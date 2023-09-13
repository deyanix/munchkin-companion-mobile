import * as React from 'react';
import { PropsWithChildren, useCallback, useState } from 'react';
import { SessionContext, SessionContextType } from './SessionContext';
import { MunchkinPlayer, MunchkinPlayerData } from '../../modules/GameModule/GameModule';

export const SessionProvider: React.FC<PropsWithChildren> = ({children}) => {
	const [players, setPlayers] = useState<MunchkinPlayer[]>([]);

	const createPlayer = useCallback(async (player: MunchkinPlayerData) => {
		// setPlayers(data ?? []);
	}, []);

	const updatePlayer = useCallback(async (player: MunchkinPlayer) => {
		// setPlayers(data ?? []);
	}, []);

	const deletePlayer = useCallback(async (playerId: number) => {
		// setPlayers(data ?? []);
	}, []);


	const sessionContext: SessionContextType = {
		players,
		createPlayer,
		updatePlayer,
		deletePlayer,
	};

	return (
		<SessionContext.Provider value={sessionContext}>
			{children}
		</SessionContext.Provider>
	);
};
