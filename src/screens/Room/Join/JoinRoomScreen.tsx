import React, { useRef } from 'react';
import { ActivityIndicator, List, MD3Colors, MD3DarkTheme, Text, useTheme } from 'react-native-paper';
import { useEffect, useMemo, useState } from 'react';
import { Animated, View } from 'react-native';
import {
	getBrand,
	getModel,
	getDeviceName,
	getDeviceNameSync, getDeviceType, getDeviceTypeSync, getCarrierSync, getManufacturerSync, getSystemName, getDeviceId
} from 'react-native-device-info';
import NetInfo, { useNetInfo } from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createNetworkIpIterator, ipToNumber, numberToIp } from '../../../utilities/ip';
import { run } from 'jest';
import { MunchkinClient } from '../../../protocol/client';
import { MunchkinDevice } from '../../../protocol/common/message';
import { DeviceListItem } from '../DeviceListItem';
import { MunchkinServer } from '../../../protocol/server';
import net from 'react-native-tcp-socket';



export function JoinRoomScreen() {
	const theme = useTheme();
	const netInfo = useNetInfo();
	const [devices, setDevices] = useState<MunchkinDevice[]>([]);

	const isWifiEnabled = useMemo(() => {
		if (netInfo.type === 'unknown') {
			return undefined;
		}

		return netInfo.type === 'wifi' && netInfo.isWifiEnabled;
	}, [netInfo]);

	useEffect(() => {
		if (netInfo.type !== 'wifi') {
			return;
		}

		const { ipAddress, subnet } = netInfo.details;
		if (!ipAddress || !subnet) {
			return;
		}

		let running = true;
		void new Promise<never>(async () => {
			const numberIp = ipToNumber(ipAddress);
			const numberSubnet = ipToNumber(subnet);
			const promises: Promise<boolean>[] = [];
			const maxClients = 10;

			// while (running) {
				const ipIterator = createNetworkIpIterator(numberIp, numberSubnet);
				for (const clientIp of ipIterator) {
					console.log('Trying connect to', numberToIp(clientIp), running, promises.length);
					if (!running) {
						break;
					}

					if (promises.length >= maxClients) {
						const device = await Promise.race(promises);
						if (device) {
							console.log('Connected successfully!');
							// setDevices(d => [...d, device]);
						} else {

							console.log('Connected failed!');
						}
					}

					// const client = new MunchkinClient({timeout: 1000});
					const socket = new net.Socket();

					const promise: Promise<any> = new Promise((resolve) => {

						socket.connect({host: numberToIp(clientIp), port: 29123, reuseAddress: true}, () => {
							resolve(true);
							console.log('SOCKET1: Connected', numberToIp(clientIp))
						}).on('error', () => {
							console.log('SOCKET1: Error', numberToIp(clientIp))
							resolve(false);
						});
					})
						.then((data) => {
							promises.splice(promises.indexOf(promise), 1);
							return data;
						});

					promises.push(promise);
				}
			// }
		});

		return () => {
			running = false;
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
	)
}
