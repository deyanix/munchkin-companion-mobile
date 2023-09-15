import * as React from 'react';
import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { SessionContext, SessionContextType, SessionControllerType } from './SessionContext';
import GameModule, {
	GuestGameConstructor,
	HostGameConstructor,
	MunchkinPlayer,
	MunchkinPlayerData
} from '../../modules/GameModule/GameModule';
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

const executePlayer = debounce(GameModule.updatePlayer, 1000);

export const SessionProvider: React.FC<PropsWithChildren> = ({children}) => {
	const [controllerType, setControllerType] = useState<SessionControllerType>();
	const [players, setPlayers] = useState<MunchkinPlayer[]>([]);

	useEffect(() => {
		const listener = GameEventEmitter.onUpdatePlayer((data) => {
			console.log('[Session context] Synchronize players', data);
			setPlayers(data);
		});
		return () => {
			listener.remove();
		};
	}, []);

	const createPlayer = useCallback((player: MunchkinPlayerData) => {
		console.log('[Session context] Create player', player);
		GameModule.createPlayer(player);
	}, []);

	const updatePlayer = useCallback((player: MunchkinPlayer) => {
		console.log('[Session context] Update player', player);
		setPlayers(data => {
			const index = data.findIndex(p => p.id === player.id);
			data[index] = player;
			return [...data];
		});
		executePlayer(player);
	}, []);

	const deletePlayer = useCallback((playerId: number) => {
		console.log('[Session context] Delete player', playerId);
		GameModule.deletePlayer(playerId);
	}, []);

	const startHostGame = useCallback((data: HostGameConstructor) => {
		GameModule.startHostGame(data);
		setPlayers([]);
		setControllerType('HOST');
	}, []);

	const startGuestGame = useCallback((data: GuestGameConstructor) => {
		GameModule.startGuestGame(data);
		setPlayers([]);
		setControllerType('HOST');
	}, []);

	const startLocalGame = useCallback(() => {
		setPlayers([]);
		setControllerType('LOCAL');
	}, []);

	const closeGame = useCallback(() => {
		GameModule.closeGame();
		setControllerType(undefined);
	}, []);

	const sessionContext: SessionContextType = {
		controllerType,
		players,
		createPlayer,
		updatePlayer,
		deletePlayer,
		startHostGame,
		startGuestGame,
		startLocalGame,
		closeGame,
	};

	return (
		<SessionContext.Provider value={sessionContext}>
			{children}
		</SessionContext.Provider>
	);
};
