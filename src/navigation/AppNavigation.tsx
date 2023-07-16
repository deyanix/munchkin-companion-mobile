import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { Appbar } from 'react-native-paper';
import { View } from 'react-native';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { JoinRoomScreen } from '../screens/Room/Join/JoinRoomScreen';
import { PlayerListScreen } from '../screens/Player/PlayerListScreen';
import { PlayerScreen } from '../screens/Player/PlayerScreen';
import { PlayerEditScreen } from '../screens/Player/PlayerEditScreen';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './index';
import { PlayerCreateScreen } from '../screens/Player/PlayerCreateScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const AppTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: 'rgb(51,51,51)',
		background: 'transparent',
	},
};

export function AppNavigation(): React.JSX.Element {
	return (
		<NavigationContainer theme={AppTheme}>
			<Stack.Navigator
				screenOptions={({ navigation }) => {
					return {
						detachPreviousScreen: !navigation.isFocused(),
						header: ({ options, back }) => {
							return (
								<Appbar.Header style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: AppTheme.colors.primary }}>
									{back ?
										<Appbar.BackAction onPress={() => navigation.goBack()} /> : <View />}
									{options.title ?
										<Appbar.Content title={options.title} style={{marginLeft: 12}} /> : undefined }
									{options.headerRight?.({ canGoBack: !!back })}
								</Appbar.Header>
							);
						}
					};
				}}>
				<Stack.Screen name="Home" component={HomeScreen} options={{title: 'Munchkin Companion'}}/>
				<Stack.Screen name="JoinRoom" component={JoinRoomScreen} options={{title: 'Dołącz'}} />
				<Stack.Screen name="PlayerList" component={PlayerListScreen} />
				<Stack.Screen name="Player" component={PlayerScreen} />
				<Stack.Screen name="PlayerEdit" component={PlayerEditScreen} />
				<Stack.Screen name="PlayerCreate" component={PlayerCreateScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	)
}
