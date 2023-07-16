import React from 'react';
import { MunchkinGender, MunchkinPlayerData } from '../../protocol/munchkin/game';
import { List } from 'react-native-paper';
import { View } from 'react-native';

export interface PlayerGenderProps  {
	player: MunchkinPlayerData;
}

export const PlayerGender: React.FC<PlayerGenderProps> = (props) => {
	return (
		<View style={{display: 'flex', flexDirection: 'row', gap: 8, marginRight: 12}}>
			{props.player.genderChanged ? <List.Icon icon="swap-horizontal"/> : undefined}
			<List.Icon icon={props.player.gender === MunchkinGender.MALE ? 'gender-male' : 'gender-female'}/>
		</View>
	);
}
