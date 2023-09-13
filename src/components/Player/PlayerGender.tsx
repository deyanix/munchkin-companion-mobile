import React from 'react';
import { List } from 'react-native-paper';
import { View } from 'react-native';
import { MunchkinPlayerData } from '../../modules/GameModule/GameModule';

export interface PlayerGenderProps  {
	player: MunchkinPlayerData;
}

export const PlayerGender: React.FC<PlayerGenderProps> = (props) => {
	return (
		<View style={{display: 'flex', flexDirection: 'row', gap: 8, marginRight: 12}}>
			{props.player.genderChanged ? <List.Icon icon="swap-horizontal"/> : undefined}
			<List.Icon icon={props.player.gender === 'MALE' ? 'gender-male' : 'gender-female'}/>
		</View>
	);
}
