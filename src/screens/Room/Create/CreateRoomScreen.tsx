import * as React from 'react';
import { Text, useTheme } from 'react-native-paper';
import { useEffect } from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SjpManager from '../../../sjp/SjpManager';
import { SjpSocket } from '../../../sjp/SjpSocket';


export function CreateRoomScreen() {
	const theme = useTheme();

	useEffect(() => {
		const promiseServer = SjpManager.createServerSocket({port: 10304});
		const promiseDiscoveryServer = SjpManager.createDiscoveryServer({port: 10304});
		const clients: SjpSocket[] = [];

		promiseServer.then(server => {
			console.log('[CREATE] Created socket server', server);
			server.onConnect((socket) => {
				console.log('[CREATE] Connected', socket);
				clients.push(socket);
				socket.send({
					test: 'Czy to zadziała?!!?!',
				});
			});
		});

		return () => {
			promiseServer.then(server => server.close());
			promiseDiscoveryServer.then(client => client.close());
			clients.forEach(client => client.close());
		};
	}, []);

	// useEffect(() => {
	// 	NetInfo.fetch('wifi').then((state) => {
	// 		if (state.type === 'wifi') {
	// 			const { ipAddress, subnet } = state.details;
	//
	// 			if (ipAddress && subnet) {
	// 				const numberIp = ipToNumber(ipAddress);
	// 				const numberSubnet = ipToNumber(subnet);
	// 				const ipIterator = createNetworkIpIterator(numberIp, numberSubnet);
	// 				for (const clientIp of ipIterator) {
	// 					console.log(numberToIp(clientIp));
	// 					break;
	// 				}
	// 			}
	// 		}
	// 	});
	//
	// 	setPlatform();
	// 	setSubtitle();
	// 	setTitle();
	// }, []);

	return (
		<View style={{alignItems: 'center', margin: 8, marginTop: 16}}>
			<Icon name="human-greeting-proximity" size={64} color={theme.colors.primary}/>
			<Text variant="titleMedium" style={{textAlign: 'center', marginTop: 16, marginBottom: 4}}>
				Teraz czekamy na Twoich znajomych, żeby rozpocząć pełną przygód sesję Munchkina
			</Text>
		</View>
	);
}
