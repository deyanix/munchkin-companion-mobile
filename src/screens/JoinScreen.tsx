import { ActivityIndicator, List, MD3Colors, MD3DarkTheme, Text } from 'react-native-paper';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import DeviceInfo, {
	getUniqueId,
	getManufacturer,
	getBrand,
	getModel,
	getDeviceName,
	getDeviceNameSync, getDeviceType, getDeviceTypeSync, getCarrierSync, getManufacturerSync, getSystemName, getDeviceId
} from 'react-native-device-info';
import NetInfo from '@react-native-community/netinfo';

function numberToIp(ip: number): string {
	return [3, 2, 1, 0].map(s => ((1 << ((s + 1) * 8)) - (1 << (s * 8)) & ip) >>> (s * 8)).join('.')
}

function ipToNumber(ip: string): number {
	return ip.split('.').map(f => parseInt(f)).reverse().reduce((previous, current, index) => previous | (current << (index * 8)), 0) >>> 0
}

export function JoinScreen() {
	const [title, setTitle] = useState<string>();
	const [subtitle, setSubtitle] = useState<string>();
	const [platform, setPlatform] = useState<string>();


	useEffect(() => {
		NetInfo.fetch('wifi').then((state) => {
			if (state.type === 'wifi') {
				const { ipAddress, subnet } = state.details;

				if (ipAddress && subnet) {
					const numberIp = ipToNumber(ipAddress);
					const numberSubnet = ipToNumber(subnet);
					const numberWildcard = (~numberSubnet & 4294967295) >>> 0;
					const numberNetworkIp = (numberIp & numberSubnet) >>> 0;

					console.log([...Array(numberWildcard).keys()].map(w => numberToIp(numberNetworkIp + w)));
				}
			}
		});

		setPlatform(getSystemName());
		setSubtitle(getManufacturerSync());
		setTitle(getDeviceNameSync());
	}, []);

	return (
		<>
			<List.Section>
				<List.Item title={title} description={subtitle} left={(p) => <List.Icon {...p} icon="android"/>} />
				<List.Item title="kr1stoffer 3310" description="Nokia" left={(p) => <List.Icon {...p} icon="cellphone"/>} />
				<List.Item title="SM-S911B" description="Samsung" left={(p) => <List.Icon {...p} icon="android"/>} />
				<List.Item title="XD" description="Apple" left={(p) => <List.Icon {...p} icon="apple-ios"/>} />
			</List.Section>
		<View style={{alignItems: 'center', gap: 16}}>
			<ActivityIndicator animating={true} color={MD3DarkTheme.colors.primary} size="large" />
			<Text variant="titleMedium">Wyszukiwanie pokoju...</Text>
		</View>
		</>
	)
}
