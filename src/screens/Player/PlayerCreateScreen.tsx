import React, { useEffect, useState } from 'react';
import { IconButton } from 'react-native-paper';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PlayerEditor } from '../../components/Player/PlayerEditor';
import { useSessionContext } from '../../components/Session/SessionContext';
import { MunchkinPlayerData } from '../../modules/GameModule/GameModule';

export function PlayerCreateScreen(): React.JSX.Element {
	const {createPlayer} = useSessionContext();
	const navigation = useNavigation();
	const [player, setPlayer] = useState<MunchkinPlayerData>({
		name: '',
		gender: 'MALE',
		genderChanged: false,
		gear: 0,
		level: 1,
	});

	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<View style={{flexDirection: 'row'}}>
					<IconButton
						icon="check"
						onPress={() => {
							createPlayer(player);
							navigation.goBack();
						}}/>
				</View>
			),
		});
	}, [navigation, player, createPlayer]);

	return (
		<PlayerEditor player={player} onChange={setPlayer}/>
	);
}

