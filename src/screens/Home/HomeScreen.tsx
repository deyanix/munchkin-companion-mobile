import { Button, Text } from 'react-native-paper';
import { View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import { useSessionContext } from '../../components/Session/SessionContext';
import SjpModule from '../../protocol/sjp/SjpModule';

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export function HomeScreen() {
	const navigation = useNavigation<HomeNavigationProp>();
	const {startServer, close} = useSessionContext();

	useFocusEffect(useCallback(() => {
		close();
	}, [close]));

	const onCreateRoom = useCallback(() => {
		startServer();
		navigation.navigate('PlayerList');
	}, [navigation, startServer]);

	const onDownload = useCallback(() => {
		SjpModule.createBackgroundServerSocket({port: 10304});
	}, []);

	return (
		<>
			<Text variant="bodyLarge" style={{marginTop: 16, marginBottom: 48, textAlign: 'center'}}>
				Rozpocznij kolejną ekscytującą sesję w Munchkina!
			</Text>
			<View style={{alignItems: 'center', gap: 8}}>
				<Button mode="contained" onPress={onCreateRoom}>Utwórz pokój</Button>
				<Text>lub</Text>
				<Button onPress={() => navigation.navigate('JoinRoom')}>Dołącz do istniejącego</Button>
				<Text>lub</Text>
				<Button onPress={onDownload}>Testuj notyfikację</Button>
			</View>
		</>
	);
}
