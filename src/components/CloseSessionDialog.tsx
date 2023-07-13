import React from 'react';
import { Button, Dialog, Portal, Text } from 'react-native-paper';

export interface CloseSessionDialogProps {
	visible: boolean;
	onDismiss?: () => void;
	onOk?: () => void;
	onCancel?: () => void;
}

export const CloseSessionDialog: React.FC<CloseSessionDialogProps> = (props) => {
	return (
		<Dialog visible={props.visible} onDismiss={props.onDismiss}>
			<Dialog.Title>Opuszczenie pokoju</Dialog.Title>
			<Dialog.Content>
				<Text variant="bodyMedium">Jesteś właścicielem pokoju. Jeżeli wyjdziesz, Twoi kompani stracą dostęp do swoich postaci! Na pewno chcesz to zrobić?</Text>
			</Dialog.Content>
			<Dialog.Actions>
				<Button onPress={props.onCancel}>Cofnij</Button>
				<Button onPress={props.onOk}>Oczywiście</Button>
			</Dialog.Actions>
		</Dialog>
	);
}
