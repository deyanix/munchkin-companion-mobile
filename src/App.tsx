import React from 'react';
import { MD3DarkTheme, PaperProvider } from 'react-native-paper';
import { View } from 'react-native';
import { AppNavigation } from './navigation/AppNavigation';

function App(): React.JSX.Element {
	return (
		<PaperProvider theme={MD3DarkTheme}>
			<View style={{ backgroundColor: MD3DarkTheme.colors.background, height: '100%' }}>
				<AppNavigation/>
			</View>
		</PaperProvider>
	);
}

export default App;
