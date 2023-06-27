import React, { useEffect, useState } from 'react';
import {
	Checkbox,
	Divider, IconButton,
	List,
	MD3Colors,
	MD3DarkTheme,
	RadioButton,
	Switch,
	Text,
	TextInput
} from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { PlayerGender } from '../components/PlayerCard';
import CheckboxItem from 'react-native-paper/lib/typescript/src/components/Checkbox/CheckboxItem';
import { useNavigation } from '@react-navigation/native';

export function PlayerEditScreen(): React.JSX.Element {
	const navigation = useNavigation();
	const [name, setName] = useState<string>('Michał Janiak');

	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<View style={{flexDirection: 'row'}}>
					<IconButton icon="delete" onPress={() => {}}/>
					<IconButton icon="check" onPress={() => {}}/>
				</View>
			)
		})
	}, [])

	return (
		<View style={{display: 'flex', flexDirection: 'column', marginVertical: 8}}>

			<View style={{marginHorizontal: 16}}>
				<TextInput value={name} onChangeText={setName} style={{marginBottom: 16}} label="Nazwa" mode="outlined"/>
			</View>
			<Divider />
			<List.Subheader>Płeć</List.Subheader>
			<View>
				<RadioButton.Group
					value={PlayerGender.MALE.toString()}
					onValueChange={() => {}}
				>
					<RadioButton.Item label="Mężczyzna" value={PlayerGender.MALE.toString()} />
					<RadioButton.Item label="Kobieta" value={PlayerGender.FEMALE.toString()} />
				</RadioButton.Group>
				<Checkbox.Item label="Zmieniona płeć" status="checked"/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8
	},
});
