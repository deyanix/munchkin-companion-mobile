import { List } from 'react-native-paper';
import React from 'react';
import { GameDiscoveryItem } from '../../modules/GameModule/GameEventEmitter';

export interface DeviceListItemProps {
	discoveryItem: GameDiscoveryItem;
	onPress?: () => void;
}

export function DeviceListItem(props: DeviceListItemProps): React.JSX.Element {

	return (
		<List.Item
			title={props.discoveryItem.device.manufacturer}
			description={props.discoveryItem.device.model}
			left={p => <List.Icon {...p} icon="cellphone"/>}
			onPress={props.onPress} />
	);
}
