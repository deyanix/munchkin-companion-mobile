import { List, ListItemProps } from 'react-native-paper';
import React, { useCallback } from 'react';
import { MunchkinDevice } from '../../protocol/munchkin/MunchkinModels';
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
			left={(p) => <List.Icon {...p} icon="cellphone"/>}
			onPress={props.onPress} />
	);
}
