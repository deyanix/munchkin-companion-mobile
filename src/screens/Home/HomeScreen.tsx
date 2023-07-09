import {  Button, Text } from 'react-native-paper';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export function HomeScreen() {
	const navigation = useNavigation<HomeNavigationProp>();

	return (
		<>
			<Text variant="bodyLarge" style={{marginTop: 16, marginBottom: 48, textAlign: 'center'}}>
				Rozpocznij kolejną ekscytującą sesję w Munchkina!
			</Text>
			<View style={{alignItems: 'center', gap: 8}}>
				<Button mode="contained" onPress={() => navigation.navigate('CreateRoom')}>Utwórz pokój</Button>
				<Text>lub</Text>
				<Button onPress={() => navigation.navigate('JoinRoom')}>Dołącz do istniejącego</Button>
			</View>
		</>
	)
}
