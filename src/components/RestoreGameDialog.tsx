import React from 'react';
import { DialogProps } from './DialogExecutor/DialogExecutorContext';
import { Button, Dialog, Text } from 'react-native-paper';

export const RestoreGameDialog: React.FC<DialogProps> = (props) => {
	return (
		<Dialog visible={props.visible} onDismiss={props.onDismiss}>
			<Dialog.Title>Poprzednia gra</Dialog.Title>
			<Dialog.Content>
				<Text variant="bodyMedium">Czy chcesz kontynuować poprzedną grę?</Text>
			</Dialog.Content>
			<Dialog.Actions>
				<Button onPress={() => props.onOk?.('new')}>Nowa</Button>
				<Button onPress={() => props.onOk?.('continue')}>Kontynuuj</Button>
			</Dialog.Actions>
		</Dialog>
	);
}
