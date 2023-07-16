import React, { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { PlayerAvatar } from '../components/PlayerAvatar';
import { Card, Divider, IconButton, List, MD3DarkTheme, Text } from 'react-native-paper';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { useSessionContext } from '../components/Session/SessionContext';
import { PlayerGender } from '../components/PlayerGender';

type PlayerNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Player'>;
type PlayerRouteProp = RouteProp<RootStackParamList, 'Player'>;

export const PlayerScreen: React.FC = () => {
	const navigation = useNavigation<PlayerNavigationProp>();
	const route = useRoute<PlayerRouteProp>();
	const { players } = useSessionContext();

	const player = useMemo(
		() => players.find(p => p.id === route.params.id),
		[players, route]
	);

	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<View style={{flexDirection: 'row'}}>
					<IconButton
						icon="pencil"
						onPress={() => navigation.navigate('PlayerEdit', {id: route.params.id})}
					/>
				</View>
			),
		});
	}, [navigation, route]);

	if (!player) {
		return (
			<View style={{margin: 8, gap: 8}}>
				<Text>Nieznaleziono gracza :(</Text>
			</View>
		);
	}

	return (
		<View style={{margin: 8, gap: 8}}>
			<Card>
				<Card.Content style={{marginBottom: 16}}>
					<View style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12}}>
						<PlayerAvatar player={player} size={64}/>
						<Text variant="headlineLarge">{player.name}</Text>
						<PlayerGender player={player}/>
					</View>
				</Card.Content>
				<Divider style={{backgroundColor: MD3DarkTheme.colors.primary}}/>
				<Card.Content>
					<View style={{display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16}}>
						<View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 48}}>
							<View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16}}>
								<List.Icon icon="chevron-double-up"/>
								<Text variant="titleLarge">Poziom</Text>
							</View>
							<View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8}}>
								<IconButton icon="chevron-down" onPress={() => {}}/>
								<Text variant="titleLarge">{player.level}</Text>
								<IconButton icon="chevron-up" onPress={() => {}}/>
							</View>
						</View>
						<View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 48}}>
							<View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16}}>
								<List.Icon icon="sword"/>
								<Text variant="titleLarge">Przedmioty</Text>
							</View>
							<View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8}}>
								<IconButton icon="chevron-down" onPress={() => {}}/>
								<Text variant="titleLarge">{player.gear}</Text>
								<IconButton icon="chevron-up" onPress={() => {}}/>
							</View>
						</View>
						<View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 48}}>
							<View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16}}>
								<List.Icon icon="sword-cross"/>
								<Text variant="titleLarge">Siła</Text>
							</View>
							<Text variant="titleLarge" style={{marginRight: 60}}>{player.level + player.gear}</Text>
						</View>
					</View>
				</Card.Content>
			</Card>
		</View>
	);
};
