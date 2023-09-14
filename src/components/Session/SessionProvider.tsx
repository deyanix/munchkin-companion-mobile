import * as React from 'react';
import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { SessionContext, SessionContextType } from './SessionContext';
import GameModule, { MunchkinPlayer, MunchkinPlayerData } from '../../modules/GameModule/GameModule';
import GameEventEmitter from '../../modules/GameModule/GameEventEmitter';

function debounce<F extends (...args: any[]) => void>(func: F, delay: number): F {
	let timerId: ReturnType<typeof setTimeout>;

	// @ts-ignore
	return (...args: Parameters<F>): void => {
		if (!timerId) {
			func(...args);
		}
		clearTimeout(timerId);

		timerId = setTimeout(() => func(...args), delay);
	};
};

export const SessionProvider: React.FC<PropsWithChildren> = ({children}) => {
	const [players, setPlayers] = useState<MunchkinPlayer[]>([]);

	useEffect(() => {
		const listener = GameEventEmitter.onUpdatePlayer((data) => {
			console.log('synchro players', data);
			setPlayers(data);
		});
		return () => {
			listener.remove();
		};
	}, []);

	const createPlayer = useCallback(async (player: MunchkinPlayerData) => {
		GameModule.createPlayer(player);
	}, []);

	const updatePlayer = useCallback((player: MunchkinPlayer) => {
		setPlayers(players => ([
			...players.filter(p => p.id !== player.id),
			player,
		]));
		executePlayer(player);
	}, []);

	const executePlayer = useCallback(debounce(async (player: MunchkinPlayer) => {
		GameModule.updatePlayer(player);
	}, 200), []);

	const deletePlayer = useCallback(async (playerId: number) => {
		GameModule.deletePlayer(playerId);
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
