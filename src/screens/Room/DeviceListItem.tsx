import { List, ListItemProps } from 'react-native-paper';
import React, { useCallback, useMemo } from 'react';
import { MunchkinDevice } from '../../protocol/common/message';

export interface DeviceListItemProps {
	device: MunchkinDevice;
}

export function DeviceListItem(props: DeviceListItemProps): React.JSX.Element {

	const icon = useCallback((p: Partial<ListItemProps>) => {
		switch (props.device.system) {
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
			onPress={() => {}} />
	);
}
