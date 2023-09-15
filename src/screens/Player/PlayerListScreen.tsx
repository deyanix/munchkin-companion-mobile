import React, { useEffect } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import PlayerCard from '../../components/Player/PlayerCard';
import { useSessionContext } from '../../components/Session/SessionContext';
import { useNavigation } from '@react-navigation/native';
import { IconButton } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';

type PlayerListNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PlayerList'>;
export function PlayerListScreen(): React.JSX.Element {
  const navigation = useNavigation<PlayerListNavigationProp>();
  const {closeGame} = useSessionContext();
  const { players } = useSessionContext();


  useEffect(() => {
    const cancelListener = navigation.addListener('beforeRemove', (e) => {

      e.preventDefault();
      Alert.alert(
        'Discard changes?',
        'You have unsaved changes. Are you sure to discard them and leave the screen?',
        [
          { text: "Don't leave", style: 'cancel', onPress: () => {} },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => {
              closeGame();
              navigation.dispatch(e.data.action);
            },
          },
        ]
      );
    });

    navigation.setOptions({
      headerRight: () => (
        <View style={{flexDirection: 'row'}}>
          <IconButton
            icon="plus"
            onPress={() => navigation.navigate('PlayerCreate')}
          />
        </View>
      ),
    });

    return () => cancelListener();
  }, [closeGame, navigation]);

  return (
    <ScrollView>
      <View style={{margin: 8, display: 'flex', gap: 8}}>
        {players.map(player => <PlayerCard player={player} key={player.id} />)}
      </View>
    </ScrollView>
  );
}
