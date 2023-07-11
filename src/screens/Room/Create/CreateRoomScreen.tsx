import * as React from 'react';
import { useEffect } from 'react';
import { Text, useTheme } from 'react-native-paper';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MunchkinServer } from '../../../protocol/munchkin/server';
import { getDeviceNameSync, getManufacturerSync, getSystemName } from 'react-native-device-info';


export function CreateRoomScreen() {
	const theme = useTheme();

	useEffect(() => {
		const server = MunchkinServer.start(10304, {
			name: getDeviceNameSync(),
			manufacturer: getManufacturerSync(),
			system: getSystemName(),
		});

		return () => {
			server.then((s) => s.close());
		};
	}, []);

	return (
		<View style={{alignItems: 'center', margin: 8, marginTop: 16}}>
			<Icon name="human-greeting-proximity" size={64} color={theme.colors.primary}/>
			<Text variant="titleMedium" style={{textAlign: 'center', marginTop: 16, marginBottom: 4}}>
				Teraz czekamy na Twoich znajomych, żeby rozpocząć pełną przygód sesję Munchkina
			</Text>
		</View>
	);
}
