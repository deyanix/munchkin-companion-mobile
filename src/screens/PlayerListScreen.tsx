import React, { useEffect, useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import PlayerCard from '../components/PlayerCard';
import { useSessionContext } from '../components/Session/SessionContext';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { IconButton } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';

type PlayerListNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PlayerList'>;
export function PlayerListScreen(): React.JSX.Element {
  const navigation = useNavigation<PlayerListNavigationProp>();
  const { players } = useSessionContext();

  useEffect(() => {
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
  }, [navigation]);

  return (
    <ScrollView>
      <View style={{margin: 8, display: 'flex', gap: 8}}>
        {players.map(player => <PlayerCard player={player} key={player.id} />)}
      </View>
    </ScrollView>
  );
}
