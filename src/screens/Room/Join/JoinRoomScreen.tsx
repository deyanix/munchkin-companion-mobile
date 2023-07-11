import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, List, MD3DarkTheme, Text, useTheme } from 'react-native-paper';
import { View } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { calculateBroadcast, ipToNumber, numberToIp } from '../../../utilities/ip';
import { MunchkinDevice } from '../../../protocol/common/message';
import { DeviceListItem } from '../DeviceListItem';
import SjpManager from '../../../sjp/SjpManager';
import { SjpSocket } from '../../../sjp/SjpSocket';


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

		const promiseClients: Promise<SjpSocket>[] = [];
		const promiseDiscoveryClient = SjpManager.createDiscoveryClient({port: 10304, address: broadcast});

		promiseDiscoveryClient.then((discoveryClient) => {
			console.log('[JOIN] Created discovery server', discoveryClient);
			discoveryClient.onDiscover((event) => {
				console.log('[JOIN] Received discover event', event.address);
				const promiseClient = SjpManager.createSocket(event);
				promiseClients.push(promiseClient);

				console.log('[JOIN] Waiting for socket...', event.address);
				promiseClient.then((client) => {
					console.log('[JOIN] Created socket', client);
					client.onMessage((msg) => {
						console.log('[JOIN] Test message', msg);
					});
					client.onClose(() => {
						console.log('[JOIN] Closed');
					});
					client.onError(() => {
						console.log('[JOIN] Error');
					});
				});
			});
		});


		return () => {
			promiseDiscoveryClient.then(client => client.close());
			promiseClients.forEach(promiseClient => promiseClient.then(client => client.close()));
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
