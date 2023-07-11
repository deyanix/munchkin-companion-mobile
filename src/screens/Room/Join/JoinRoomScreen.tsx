import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, List, MD3DarkTheme, Text, useTheme } from 'react-native-paper';
import { View } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { calculateBroadcast, ipToNumber, numberToIp } from '../../../utilities/ip';
import { MunchkinDevice } from '../../../protocol/munchkin/message';
import { DeviceListItem } from '../DeviceListItem';
import { MunchkinDiscoveryClient } from '../../../protocol/munchkin/discoveryClient';


export function JoinRoomScreen() {
	const theme = useTheme();
	const netInfo = useNetInfo();
	const [devices ] = useState<MunchkinDevice[]>([]);

	const isWifiEnabled = useMemo(() => {
		if (netInfo.type === 'unknown') {
			return undefined;
		}

		return netInfo.type === 'wifi' && netInfo.isWifiEnabled;
	}, [netInfo]);

	useEffect(() => {
		if (netInfo.type !== 'wifi' || !netInfo.isWifiEnabled) {
			return;
		}
		if (!netInfo.details.ipAddress || !netInfo.details.subnet) {
			return;
		}

		const ipAddress = ipToNumber(netInfo.details.ipAddress);
		const subnet = ipToNumber(netInfo.details.subnet);
		const broadcast = numberToIp(calculateBroadcast(ipAddress, subnet));

		const discoveryClient = MunchkinDiscoveryClient.start(broadcast, 10304);
		discoveryClient.then(client => {
			console.log('[JOIN] Created');
			client.on('connect', (connection) => {
				console.log('[JOIN] Connected');
				connection.on('welcome', () => {
					console.log('[JOIN] Welcomed');
				});
			});
		});
		return () => {
			console.log('[JOIN] Close');
			discoveryClient.then(client => client.close());
		};
	}, [netInfo]);


	return (
		<>
			{isWifiEnabled === undefined ? <></> :
				!isWifiEnabled ? (
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
