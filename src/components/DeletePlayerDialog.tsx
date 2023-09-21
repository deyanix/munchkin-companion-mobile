import React from 'react';
import { DialogProps } from './DialogExecutor/DialogExecutorContext';
import { Button, Dialog, Text } from 'react-native-paper';

export const DeletePlayerDialog: React.FC<DialogProps> = (props) => {
	return (
		<Dialog visible={props.visible} onDismiss={props.onDismiss}>
			<Dialog.Title>Usuwanie gracza</Dialog.Title>
			<Dialog.Content>
				<Text variant="bodyMedium">Czy jesteś pewien, że chcesz usunąć swojego kompana z gry?</Text>
			</Dialog.Content>
			<Dialog.Actions>
				<Button onPress={props.onCancel}>Anuluj</Button>
				<Button onPress={props.onOk}>Oczywiście</Button>
			</Dialog.Actions>
		</Dialog>
	);
}
