import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, List, MD3DarkTheme, Text, useTheme } from 'react-native-paper';
import { View } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { calculateBroadcast, ipToNumber, numberToIp } from '../../../utilities/ip';
import GameModule from '../../../modules/GameModule/GameModule';
import GameEventEmitter, { GameDiscoveryItem } from '../../../modules/GameModule/GameEventEmitter';
import { DeviceListItem } from '../DeviceListItem';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation';
import { useNavigation } from '@react-navigation/native';
import { useSessionContext } from '../../../components/Session/SessionContext';

type JoinRoomNavigationProp = NativeStackNavigationProp<RootStackParamList, 'JoinRoom'>;

export function JoinRoomScreen() {
	const theme = useTheme();
	const netInfo = useNetInfo();
	const [devices, setDevices] = useState<GameDiscoveryItem[]>([]);
	const navigation = useNavigation<JoinRoomNavigationProp>();
	const {startGuestGame} = useSessionContext();

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

	useEffect(() => {
		const listener = GameEventEmitter.onDiscovery((event) => {
			setDevices(event);
		});
		return () => {
			listener.remove();
		};
	}, []);

	useEffect(() => {
		if (broadcastAddress) {
			GameModule.startDiscovery({address: broadcastAddress, port: 10304});
		}
		return () => GameModule.closeDiscovery();
	}, [broadcastAddress]);

	function startSession(item: GameDiscoveryItem) {
		startGuestGame(item);
		GameModule.closeDiscovery();
		navigation.navigate('PlayerList');
	}

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
						{devices.map(device =>
							<DeviceListItem
								key={device.address + device.port}
								discoveryItem={device}
								onPress={() => startSession(device)}/>
						)}
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
