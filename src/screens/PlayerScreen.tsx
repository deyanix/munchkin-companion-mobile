import React, { useEffect } from 'react';
import { View } from 'react-native';
import { PlayerAvatar } from '../components/PlayerAvatar';
import {
	Button,
	Card,
	Dialog,
	Divider,
	IconButton,
	List, MD3DarkTheme,
	Portal,
	Text,
	TextInput,
	TouchableRipple
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export function PlayerScreen(): React.JSX.Element {
	const navigation = useNavigation();

	const [text, setText] = React.useState('');

	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<View style={{flexDirection: 'row'}}>
					<IconButton icon="pencil" onPress={() => {}}/>
				</View>
			)
		})
	}, [])


	return (
		<>
		<View style={{margin: 8, gap: 8}}>

		<Card>
			<Card.Content style={{marginBottom: 16}}>
				<View style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12}}>
					<PlayerAvatar name="Michał Janiak" size={64}/>
						<Text variant="headlineLarge">Michał Janiak</Text>
						<View style={{flexDirection: 'row', gap: 12}}>
							<List.Icon icon="swap-horizontal"/>
							<List.Icon icon="gender-male"/>
						</View>
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
					<Text variant="titleLarge">4</Text>
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
					<Text variant="titleLarge">3</Text>
					<IconButton icon="chevron-up" onPress={() => {}}/>
				</View>
			</View>
			<View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 48}}>
				<View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16}}>
					<List.Icon icon="sword-cross"/>
					<Text variant="titleLarge">Siła</Text>
				</View>
				<Text variant="titleLarge" style={{marginRight: 60}}>7</Text>
			</View>
		</View>
	</Card.Content>
		</Card>
		</View>
		</>
	);
}
