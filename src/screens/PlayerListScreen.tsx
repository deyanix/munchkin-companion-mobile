import React from 'react';
import { View } from 'react-native';
import PlayerCard, { PlayerGender } from '../components/PlayerCard';

export function PlayerListScreen(): React.JSX.Element {
  return (
    <View style={{margin: 8, display: 'flex', gap: 8}}>
      <PlayerCard name="Michał Janiak" gear={5} level={3} gender={PlayerGender.MALE} />
      <PlayerCard name="Andrzej Chmiel" gear={6} level={2} gender={PlayerGender.FEMALE} genderChanged={true}/>
      <PlayerCard name="Krzysztof Fryta" gear={12} level={1} gender={PlayerGender.MALE} />
    </View>
  );
}
