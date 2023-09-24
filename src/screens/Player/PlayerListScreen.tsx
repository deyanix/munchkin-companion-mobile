import React, { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import PlayerCard from '../../components/Player/PlayerCard';
import { useSessionContext } from '../../components/Session/SessionContext';
import { useNavigation } from '@react-navigation/native';
import { IconButton } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { useDialogExecutor } from '../../components/DialogExecutor/DialogExecutorContext';
import { CloseSessionDialog } from '../../components/CloseSessionDialog';

type PlayerListNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PlayerList'>;
export function PlayerListScreen(): React.JSX.Element {
  const navigation = useNavigation<PlayerListNavigationProp>();
  const { controllerType, closeGame } = useSessionContext();
  const { players } = useSessionContext();
  const dialogExecutor = useDialogExecutor();

  useEffect(() => {
    const cancelListener = navigation.addListener('beforeRemove', (e) => {
      if (controllerType !== 'HOST') {
        return;
      }

      e.preventDefault();
      dialogExecutor.create(CloseSessionDialog)
        .onOk(() => {
          closeGame();
          navigation.dispatch(e.data.action);
        });
    });

    navigation.setOptions({
      headerBackVisible: false,
      headerRight: () => (
        <View style={{flexDirection: 'row'}}>
          {controllerType === 'HOST' &&
            <IconButton icon="wifi" />}
          <IconButton
            icon="plus"
            onPress={() => navigation.navigate('PlayerCreate')}
          />
        </View>
      ),
    });

    return () => cancelListener();
  }, [closeGame, controllerType, dialogExecutor, navigation]);

  return (
    <ScrollView>
      <View style={{margin: 8, display: 'flex', gap: 8}}>
        {players.map(player => <PlayerCard player={player} key={player.id} />)}
      </View>
    </ScrollView>
  );
}
