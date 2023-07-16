import { Card, List, Text } from 'react-native-paper';
import { View } from 'react-native';
import React from 'react';
import { PlayerAvatar } from './PlayerAvatar';
import { useNavigation } from '@react-navigation/native';
import { MunchkinGender, MunchkinPlayer } from '../protocol/munchkin/game';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { PlayerGender } from './PlayerGender';

type PlayerNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export interface PlayerCardProps {
  player: MunchkinPlayer;
}

export function PlayerCard(props: PlayerCardProps) {
  const navigation = useNavigation<PlayerNavigationProp>();

  return (
    <Card onPress={() => navigation.navigate('Player', {id: props.player.id}) }>
      <Card.Title
        left={(p) => <PlayerAvatar {...p} player={props.player}/>}
        right={() => <PlayerGender player={props.player}/>}
        title={props.player.name}/>
      <Card.Content>
        <View style={{display: 'flex', flexDirection: 'row'}}>
          <View style={{flex: 1, alignItems: 'flex-start'}}>
            <View style={{display: 'flex', flexDirection: 'row', gap: 8}}>
              <List.Icon icon="chevron-double-up" />
              <Text>{props.player.level}</Text>
            </View>
          </View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <View style={{display: 'flex', flexDirection: 'row', gap: 8}}>
              <List.Icon icon="sword" />
              <Text>{props.player.gear}</Text>
            </View>
          </View>
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <View style={{display: 'flex', flexDirection: 'row', gap: 8}}>
              <List.Icon icon="sword-cross" />
              <Text>{props.player.level+props.player.gear}</Text>
            </View>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}

export default PlayerCard;
