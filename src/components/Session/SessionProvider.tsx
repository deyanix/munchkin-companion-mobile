import * as React from 'react';
import { PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';
import { SessionContext, SessionContextType, SessionInstance } from './SessionContext';
import { MunchkinServer } from '../../protocol/munchkin/server';
import { getDeviceNameSync, getManufacturerSync, getSystemName } from 'react-native-device-info';
import { MunchkinPlayer, MunchkinPlayerData } from '../../protocol/munchkin/game';
import { MunchkinClient } from '../../protocol/munchkin/client';

export const SessionProvider: React.FC<PropsWithChildren> = ({children}) => {
	const [instance, setInstance] = useState<SessionInstance>();
	const [players, setPlayers] = useState<MunchkinPlayer[]>([]);
	const nextPlayerId = useRef<number>(1);

	const startClient = useCallback(async (client: MunchkinClient) => {
		setPlayers([]);
		setInstance({
			type: 'client',
			client,
		});

		client.on('update', (data) => {
			console.log('[PROVIDER] Received players', data);
			setPlayers(data);
		});
		setPlayers(await client.synchronize());
	}, []);

	const startServer = useCallback(async () => {
		setPlayers([]);

		const server = await MunchkinServer.start(10304, {
			name: getDeviceNameSync(),
			manufacturer: getManufacturerSync(),
			system: getSystemName(),
		});
		server.on('update', (data) => {
			console.log('[PROVIDER] Received players', data);
			setPlayers(data);
		});

		setInstance({
			type: 'server',
			server,
		});
	}, []);

	const handleUpdate = useCallback((data: MunchkinPlayer[]) => {
		setPlayers(data);
		console.log('[PROVIDER] Update players', instance?.type);
		if (instance?.type === 'server') {
			instance.server.players = data;
			instance.server.update(data);
		} else if (instance?.type === 'client') {
			instance.client.update(data);
		}
	}, [instance]);

	const createPlayer = useCallback((player: MunchkinPlayerData) => {
		handleUpdate([
			{...player, id: nextPlayerId.current++},
			...players,
		]);
	}, [players, handleUpdate]);

	const updatePlayer = useCallback((player: MunchkinPlayer) => {
		handleUpdate([
			...players.filter(p => p.id !== player.id),
			player,
		]);
	}, [players, handleUpdate]);

	const close = useCallback(() => {
		console.log('[PROVIDER] Close connections', instance?.type);
		if (instance?.type === 'client') {
			instance.client.close();
			setInstance(undefined);
		} else if (instance?.type === 'server') {
			instance.server.close();
			setInstance(undefined);
		}
	}, [instance]);

	useEffect(() => {
		return close;
	}, [close]);

	const sessionContext: SessionContextType = {
		instance,
		players,
		createPlayer,
		updatePlayer,
		startClient,
		startServer,
		close,
	};

	return (
		<SessionContext.Provider value={sessionContext}>
			{children}
		</SessionContext.Provider>
	);
};
