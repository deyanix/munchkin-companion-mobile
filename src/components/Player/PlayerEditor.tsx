import React from 'react';
import { View } from 'react-native';
import { Checkbox, Divider, List, RadioButton, TextInput } from 'react-native-paper';
import { MunchkinGender, MunchkinPlayerData } from '../../modules/GameModule/GameModule';

export interface PlayerEditorProps<T extends MunchkinPlayerData> {
	player: T;
	onChange?: (player: T) => void;
}

export function PlayerEditor<T extends MunchkinPlayerData>(props: PlayerEditorProps<T>) {
	function onChangeName(name: string) {
		props.onChange?.({
			...props.player,
			name,
		});
	}

	function onChangeGender(gender: MunchkinGender) {
		props.onChange?.({
			...props.player,
			gender,
		});
	}

	function toggleGenderChanged() {
		props.onChange?.({
			...props.player,
			genderChanged: !props.player?.genderChanged,
		});
	}

	return (
		<View style={{display: 'flex', flexDirection: 'column', marginVertical: 8}}>
			<View style={{marginHorizontal: 16}}>
				<TextInput
					value={props.player?.name}
					onChangeText={onChangeName}
					style={{marginBottom: 16}}
					label="Nazwa"
					mode="outlined"
				/>
			</View>
			<Divider />
			<List.Subheader>Płeć</List.Subheader>
			<View>
				<RadioButton.Group
					value={props.player?.gender?.toString() ?? ''}
					onValueChange={(val) => onChangeGender(val as MunchkinGender)}
				>
					<RadioButton.Item label="Mężczyzna" value={'MALE'} />
					<RadioButton.Item label="Kobieta" value={'FEMALE'} />
				</RadioButton.Group>
				<Checkbox.Item
					status={props.player?.genderChanged ? 'checked' : 'unchecked'}
					onPress={toggleGenderChanged}
					label="Zmieniona płeć"
				/>
			</View>
		</View>
	)
}
