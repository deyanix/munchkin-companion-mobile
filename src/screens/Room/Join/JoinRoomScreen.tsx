import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, List, MD3DarkTheme, Text, useTheme } from 'react-native-paper';
import { View } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { calculateBroadcast, ipToNumber, numberToIp } from '../../../utilities/ip';
import { MunchkinDevice } from '../../../protocol/munchkin/message';
import { DeviceListItem } from '../DeviceListItem';
import { MunchkinDiscoveryClient } from '../../../protocol/munchkin/discoveryClient';
import { MunchkinClient } from '../../../protocol/munchkin/client';


export function JoinRoomScreen() {
	const theme = useTheme();
	const netInfo = useNetInfo();

	const [devices, setDevices ] = useState<MunchkinDevice[]>([]);

	const wifiDetails = useMemo(() => {
		if (netInfo.type === 'wifi' && netInfo.isWifiEnabled) {
			return netInfo.details;
		}
		return undefined;
	}, [netInfo]);

	const broadcastAddress = useMemo(() => {
		if (!wifiDetails?.ipAddress || !wifiDetails?.subnet) {
			return;
		}

		const ipAddress = ipToNumber(wifiDetails.ipAddress);
		const subnet = ipToNumber(wifiDetails.subnet);
		return numberToIp(calculateBroadcast(ipAddress, subnet));
	}, [wifiDetails]);

	const fetchDevices = useCallback((clients: MunchkinClient[]) => {
		setDevices(clients
			.map((c) => c.device)
			.filter((d): d is MunchkinDevice => !!d));
	}, []);

	const startClient = useCallback(async (address: string) => {
		const client = await MunchkinDiscoveryClient.start(address, 10304);
		client.on('connect', (connection) => {
			connection.on('welcome', () => {
				fetchDevices(client.connections);
			});
		});

		client.on('timeout', () => {
			fetchDevices(client.connections);
		});
		return client;
	}, [fetchDevices]);

	useEffect(() => {
		if (!broadcastAddress) {
			return;
		}

		const clientPromise = startClient(broadcastAddress);
		return () => {
			clientPromise.then(client => client.close());
		};
	}, [broadcastAddress, startClient]);


	return (
		<>
			{wifiDetails === undefined ? <></> :
				!wifiDetails ? (
				<View style={{alignItems: 'center', margin: 8, marginTop: 16}}>
					<Icon name="wifi-remove" size={64} color={theme.colors.primary}/>
					<Text variant="titleMedium" style={{textAlign: 'center', marginTop: 16, marginBottom: 4}}>
						Nie jesteś podłączony do sieci WiFi
					</Text>
					<Text variant="bodyMedium" style={{textAlign: 'center'}}>
						Połącz się do tej samej sieci, co Twój znajomy udostępniający pokój
					</Text>
				</View>
			) : (
				<>
					<List.Section>
						{devices.map(device => <DeviceListItem key={device.name} device={device}/>)}
					</List.Section>
					<View style={{alignItems: 'center'}}>
						<ActivityIndicator animating={true} color={MD3DarkTheme.colors.primary} size="large" />
						<Text variant="titleMedium" style={{marginTop: 12, marginBottom: 4}}>Wyszukiwanie pokoju...</Text>
						<Text variant="bodyMedium" style={{textAlign: 'center'}}>Pamiętaj, żeby być w tej samej sieci WiFi, co Twój znajomy udostępniający pokój</Text>
					</View>
				</>
			)}
		</>
	);
}
