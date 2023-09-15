import React from 'react';
import { MD3DarkTheme, PaperProvider } from 'react-native-paper';
import { View } from 'react-native';
import { AppNavigation } from './navigation/AppNavigation';
import { SessionProvider } from './components/Session/SessionProvider';
import { DialogExecutorProvider } from './components/DialogExecutor/DialogExecutorProvider';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';

export const AppTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: 'rgb(51,51,51)',
		background: 'transparent',
	},
};

function App(): React.JSX.Element {
	return (
		<PaperProvider theme={MD3DarkTheme}>
			<View style={{ backgroundColor: MD3DarkTheme.colors.background, height: '100%' }}>
				<NavigationContainer theme={AppTheme}>
					<SessionProvider>
						<DialogExecutorProvider>
							<AppNavigation/>
						</DialogExecutorProvider>
					</SessionProvider>
				</NavigationContainer>
			</View>
		</PaperProvider>
	);
}

export default App;
