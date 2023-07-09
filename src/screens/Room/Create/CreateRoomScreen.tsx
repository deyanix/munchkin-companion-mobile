import { Text, useTheme } from 'react-native-paper';
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MunchkinServer } from '../../../protocol/server';
import { getDeviceNameSync, getManufacturerSync, getSystemName } from 'react-native-device-info';


export function CreateRoomScreen() {
	const theme = useTheme();
	const netInfo = useNetInfo();
	const server = useRef<MunchkinServer>();
	const [count, setCount] = useState<number>(0);

	useEffect(() => {
		if (!server.current) {
			server.current = new MunchkinServer({timeout: 1000, device: {
					name: getDeviceNameSync(),
					manufacturer: getManufacturerSync(),
					system: getSystemName(),
				}});
			server.current.start(29123, '0.0.0.0');
		}


		const cb = () => setCount(server.current?.connections.length ?? 0);
		server.current.on('change', cb);

		const currentServer = server.current;
		return () => {
			currentServer.stop();
			currentServer.off('change', cb)
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
			<Text>
				Liczba klientów: {count}
			</Text>
			</View>
	)
}
