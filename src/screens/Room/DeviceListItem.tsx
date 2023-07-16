import { List, ListItemProps } from 'react-native-paper';
import React, { useCallback } from 'react';
import { MunchkinDevice } from '../../protocol/munchkin/message';

export interface DeviceListItemProps {
	device: MunchkinDevice;
	onPress?: () => void;
}

export function DeviceListItem(props: DeviceListItemProps): React.JSX.Element {
	const icon = useCallback((p: Partial<ListItemProps>) => {
		switch (props.device.system.toLowerCase()) {
			case 'android': return <List.Icon {...p} icon="android"/>;
			case 'ios': return <List.Icon {...p} icon="apple-ios"/>;
			default: return <List.Icon {...p} icon="cellphone"/>;
		}
	}, [props.device.system]);

	return (
		<List.Item
			title={props.device.name}
			description={props.device.manufacturer}
			left={icon}
			onPress={props.onPress} />
	);
}
