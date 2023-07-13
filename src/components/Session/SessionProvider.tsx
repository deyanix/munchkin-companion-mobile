import * as React from 'react';
import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { SessionContext, SessionContextType, SessionInstance } from './SessionContext';
import { MunchkinServer } from '../../protocol/munchkin/server';
import { getDeviceNameSync, getManufacturerSync, getSystemName } from 'react-native-device-info';

export const SessionProvider: React.FC<PropsWithChildren> = ({children}) => {
	const [instance, setInstance] = useState<SessionInstance>();


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

	const sessionContext: SessionContextType = {
		instance,
		startClient,
		startServer,
		get game() {
			return (
				instance?.type === 'server' ? instance.server.game :
					instance?.type === 'client' ? instance.client.game :
						undefined
			);
		},
	};

	return (
		<SessionContext.Provider value={sessionContext}>
			{children}
		</SessionContext.Provider>
	);
};
