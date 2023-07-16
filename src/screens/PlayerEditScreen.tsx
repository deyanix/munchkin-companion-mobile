import React, { useEffect, useState } from 'react';
import { IconButton } from 'react-native-paper';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MunchkinPlayer } from '../protocol/munchkin/game';
import { PlayerEditor } from './PlayerEditor';

export function PlayerEditScreen(): React.JSX.Element {
	const navigation = useNavigation();
	// @ts-ignore
	const [player, setPlayer] = useState<MunchkinPlayer>({});

	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<View style={{flexDirection: 'row'}}>
					<IconButton icon="delete" onPress={() => {}}/>
					<IconButton icon="check" onPress={() => {}}/>
				</View>
			),
		});
	}, [navigation]);

	return (
		<PlayerEditor player={player} onChange={setPlayer}/>
	);
}

