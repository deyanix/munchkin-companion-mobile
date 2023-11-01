import { Button, Text } from 'react-native-paper';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import { useSessionContext } from '../../components/Session/SessionContext';
import { useDialogExecutor } from '../../components/DialogExecutor/DialogExecutorContext';
import { RestoreGameDialog } from '../../components/RestoreGameDialog';

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export function HomeScreen() {
	const navigation = useNavigation<HomeNavigationProp>();
	const dialogExecutor = useDialogExecutor();
	const {startHostGame, restoreGame, restoreHostGame} = useSessionContext();
	const [hasStoredGame, setStoredGame] = useState<boolean>(false);

	useEffect(() => {
		(async () => {
			const game = await restoreGame();
			setStoredGame(!!game);
		})();
	}, [restoreGame]);

	const onCreateRoom = useCallback(() => {
		if (hasStoredGame) {
			dialogExecutor.create(RestoreGameDialog).onOk((payload) => {
				if (payload === 'new') {
					startHostGame({ port: 10304 });
					navigation.push('PlayerList');
				} else if (payload === 'continue') {
					restoreHostGame({ port: 10304 });
					navigation.push('PlayerList');
				}
			});
		} else {
			startHostGame({ port: 10304 });
			navigation.push('PlayerList');
		}
	},[dialogExecutor, hasStoredGame, navigation, restoreHostGame, startHostGame]);

	return (
		<>
			<Text variant="bodyLarge" style={{marginTop: 16, marginBottom: 48, textAlign: 'center'}}>
				Rozpocznij kolejną ekscytującą sesję w Munchkina!
			</Text>
			<View style={{alignItems: 'center', gap: 8}}>
				<Button mode="contained" onPress={onCreateRoom}>Utwórz pokój</Button>
				<Text>lub</Text>
				<Button onPress={() => navigation.navigate('JoinRoom')}>Dołącz do istniejącego</Button>
			</View>
		</>
	);
}
