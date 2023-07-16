import React, { useEffect, useMemo, useState } from 'react';
import { IconButton, Text } from 'react-native-paper';
import { View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { MunchkinGender, MunchkinPlayer, MunchkinPlayerData } from '../../protocol/munchkin/game';
import { PlayerEditor } from '../../components/Player/PlayerEditor';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { useSessionContext } from '../../components/Session/SessionContext';


type PlayerEditNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PlayerEdit'>;
type PlayerEditRouteProp = RouteProp<RootStackParamList, 'PlayerEdit'>;

export function PlayerEditScreen(): React.JSX.Element {
	const navigation = useNavigation<PlayerEditNavigationProp>();
	const route = useRoute<PlayerEditRouteProp>();
	const { players, updatePlayer } = useSessionContext();
	const [player, setPlayer] = useState<MunchkinPlayer>();

	useEffect(
		() => setPlayer(players.find(p => p.id === route.params.id)),
		[players, route]
	);

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

	if (!player) {
		return (
			<View style={{margin: 8, gap: 8}}>
				<Text>Nieznaleziono gracza :(</Text>
			</View>
		);
	}

	return (
		<PlayerEditor player={player} onChange={updatePlayer}/>
	);
}

