import * as React from 'react';
import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { SessionContext, SessionContextType, SessionInstance } from './SessionContext';
import { MunchkinServer } from '../../protocol/munchkin/MunchkinServer';
import { getDeviceNameSync, getManufacturerSync, getSystemName } from 'react-native-device-info';
import { MunchkinPlayer, MunchkinPlayerData } from '../../protocol/munchkin/MunchkinModels';
import { MunchkinClient } from '../../protocol/munchkin/MunchkinClient';

export const SessionProvider: React.FC<PropsWithChildren> = ({children}) => {
	const [instance, setInstance] = useState<SessionInstance>();
	const [players, setPlayers] = useState<MunchkinPlayer[]>([]);

	useEffect(() => {
		if (instance?.type !== 'client' && instance?.type !== 'server') {
			return;
		}

		const callback = (data: MunchkinPlayer[]) => {
			console.log('[PROVIDER] Received players', data);
			setPlayers(data);
		};

		instance.connection.on('update', callback);
		return () => instance.connection.off('update', callback);
	}, [instance]);

	const startClient = useCallback(async (client: MunchkinClient) => {
		setPlayers([]);
		setInstance({
			type: 'client',
			connection: client,
		});
		await client.synchronize();
	}, []);

	const startServer = useCallback(async () => {
		const server = await MunchkinServer.start(10304, {
			name: getDeviceNameSync(),
			manufacturer: getManufacturerSync(),
			system: getSystemName(),
		});

		setPlayers([]);
		setInstance({
			type: 'server',
			connection: server,
		});
	}, []);

	const createPlayer = useCallback(async (player: MunchkinPlayerData) => {
		const data = await instance?.connection?.create(player);
		setPlayers(data ?? []);
	}, [instance]);

	const updatePlayer = useCallback(async (player: MunchkinPlayer) => {
		const data = await instance?.connection?.update(player);
		setPlayers(data ?? []);
	}, [instance]);

	const deletePlayer = useCallback(async (playerId: number) => {
		const data = await instance?.connection?.delete(playerId);
		setPlayers(data ?? []);
	}, [instance]);

	const close = useCallback(() => {
		console.log('[PROVIDER] Close connections', instance?.type);
		instance?.connection?.close();
	}, [instance]);

	useEffect(() => {
		return close;
	}, [close]);

	const sessionContext: SessionContextType = {
		instance,
		players,
		createPlayer,
		updatePlayer,
		deletePlayer,
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
