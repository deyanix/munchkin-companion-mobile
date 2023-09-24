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
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GameManager from '../../modules/GameModule/GameManager';

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

type SessionProviderNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export const SessionProvider: React.FC<PropsWithChildren> = ({children}) => {
	const [controllerType, setControllerType] = useState<SessionControllerType>();
	const [players, setPlayers] = useState<MunchkinPlayer[]>([]);
	const navigation = useNavigation<SessionProviderNavigationProp>();

	useEffect(() => {
		(async () => {
			const backendControllerType = await GameManager.getControllerType();
			console.log('[Session context] Controller type', backendControllerType);
			setControllerType(backendControllerType);
			if (backendControllerType) {
				const backendPlayers = await GameManager.getPlayers();
				await storeGame(backendPlayers);
				console.log('[Session context] Get players', backendPlayers);
				setPlayers(backendPlayers);
				navigation.navigate('PlayerList');
			} else {
				await closeGame();
			}
		})();

		GameEventEmitter.onClose(() => {
			console.log('[Session context] On close');
			setControllerType(undefined);
			navigation.navigate('Home');
		});
		const listener = GameEventEmitter.onUpdatePlayer(async (data) => {
			console.log('[Session context] Synchronize players', data);
			await storeGame(data);
			setPlayers(data);
		});
		return () => {
			listener.remove();
		};
	}, [closeGame, navigation, storeGame]);

	const storeGame = useCallback(async (data: MunchkinPlayer[]) => {
		await AsyncStorage.setItem('players', JSON.stringify(data));
		console.log('[Session context] Stored game', data);
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

	const startHostGame = useCallback(async (data: HostGameConstructor) => {
		await GameManager.startHostGame(data);
		await storeGame([]);
		setPlayers([]);
		setControllerType('HOST');
		console.log('[Session context] Started host game');
	}, [storeGame]);

	const startGuestGame = useCallback(async (data: GuestGameConstructor) => {
		await GameManager.startGuestGame(data);
		await storeGame([]);
		setPlayers([]);
		setControllerType('GUEST');
		console.log('[Session context] Started guest game');
	}, [storeGame]);

	const startLocalGame = useCallback(async () => {
		await storeGame([]);
		setPlayers([]);
		setControllerType('LOCAL');
		console.log('[Session context] Started local game');
	}, [storeGame]);

	const closeGame = useCallback(async () => {
		await GameManager.closeGame();
		setControllerType(undefined);
		console.log('[Session context] Closed game');
	}, []);

	const restoreGame = useCallback(async (): Promise<MunchkinPlayer[] | undefined> => {
		const data = await AsyncStorage.getItem('players');
		console.log('[Session context] Get storage item', data);
		if (data) {
			return JSON.parse(data);
		}
		return undefined;
	}, []);

	const restoreHostGame = useCallback(async (data: HostGameConstructor) => {
		const restoredPlayers = (await restoreGame()) ?? [];
		await GameManager.startHostGame(data);
		await GameManager.setPlayers(restoredPlayers);
		console.log('[Session context] Restored game', restoredPlayers);
		setPlayers(restoredPlayers);
		setControllerType('HOST');
	}, [restoreGame]);

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
		restoreGame,
		restoreHostGame,
	};

	return (
		<SessionContext.Provider value={sessionContext}>
			{children}
		</SessionContext.Provider>
	);
};
