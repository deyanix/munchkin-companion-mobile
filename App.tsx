import React from 'react';
import { Appbar, MD3DarkTheme, PaperProvider } from 'react-native-paper';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PlayerScreen } from './src/screens/PlayerScreen';
import { PlayerListScreen } from './src/screens/PlayerListScreen';
import { View } from 'react-native';
import { PlayerEditScreen } from './src/screens/PlayerEditScreen';
import { JoinScreen } from './src/screens/JoinScreen';

const Stack = createNativeStackNavigator();
const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(51,51,51)',
    background: 'transparent',
  }
};

function App(): React.JSX.Element {
	return (
		<PaperProvider theme={MD3DarkTheme}>
			<View style={{ backgroundColor: MD3DarkTheme.colors.background, height: '100%' }}>
				<NavigationContainer theme={AppTheme}>
					<Stack.Navigator
						screenOptions={({ navigation }) => {
							return {
								detachPreviousScreen: !navigation.isFocused(),
								header: ({ navigation, route, options, back }) => {
									return (
										<Appbar.Header style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: AppTheme.colors.primary }}>
											{back ?
												<Appbar.BackAction onPress={() => navigation.goBack()} /> : <View />}

											{options.headerRight?.({ canGoBack: !!back })}
											{/*<Appbar.Content title="Munchkin Companion" />*/}
										</Appbar.Header>
									);
								}
							};
						}}>
						<Stack.Screen name="Join" component={JoinScreen} />
						<Stack.Screen name="PlayerList" component={PlayerListScreen} />
						<Stack.Screen name="Player" component={PlayerScreen} />
						<Stack.Screen name="PlayerEdit" component={PlayerEditScreen} />
					</Stack.Navigator>
				</NavigationContainer>
			</View>
		</PaperProvider>
	);
}

export default App;
