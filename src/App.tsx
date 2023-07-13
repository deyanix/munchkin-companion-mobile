import React from 'react';
import { MD3DarkTheme, PaperProvider } from 'react-native-paper';
import { View } from 'react-native';
import { AppNavigation } from './navigation/AppNavigation';
import { SessionProvider } from './components/Session/SessionProvider';
import { DialogExecutorProvider } from './components/DialogExecutor/DialogExecutorProvider';

function App(): React.JSX.Element {
	return (
		<PaperProvider theme={MD3DarkTheme}>
			<View style={{ backgroundColor: MD3DarkTheme.colors.background, height: '100%' }}>
				<SessionProvider>
					<DialogExecutorProvider>
						<AppNavigation/>
					</DialogExecutorProvider>
				</SessionProvider>
			</View>
		</PaperProvider>
	);
}

export default App;
