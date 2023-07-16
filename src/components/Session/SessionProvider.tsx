import * as React from 'react';
import { PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';
import { SessionContext, SessionContextType, SessionInstance } from './SessionContext';
import { MunchkinServer } from '../../protocol/munchkin/server';
import { getDeviceNameSync, getManufacturerSync, getSystemName } from 'react-native-device-info';
import { MunchkinPlayer, MunchkinPlayerData } from '../../protocol/munchkin/game';

export const SessionProvider: React.FC<PropsWithChildren> = ({children}) => {
	const [instance, setInstance] = useState<SessionInstance>();
	const [players, setPlayers] = useState<MunchkinPlayer[]>([]);
	const nextPlayerId = useRef<number>(1);

	useEffect(() => {
		return () => {
			if (instance?.type === 'client') {
				instance.client.close();
			} else if (instance?.type === 'server') {
				instance.server.close();
			}
		};
	}, [instance]);

	const startClient = useCallback(async () => {
	}, []);

	const startServer = useCallback(async () => {
		setInstance({
			type: 'server',
			server: await MunchkinServer.start(10304, {
				name: getDeviceNameSync(),
				manufacturer: getManufacturerSync(),
				system: getSystemName(),
			}),
		});
	}, []);

	const createPlayer = useCallback((player: MunchkinPlayerData) => {
		setPlayers(previous => ([
			{...player, id: nextPlayerId.current++},
			...previous,
		]));
	}, []);

	const sessionContext: SessionContextType = {
		instance,
		startClient,
		startServer,
		players,
		createPlayer,
	};

	return (
		<SessionContext.Provider value={sessionContext}>
			{children}
		</SessionContext.Provider>
	);
};
