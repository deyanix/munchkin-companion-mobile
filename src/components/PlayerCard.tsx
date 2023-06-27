import { Avatar, Card, IconButton, List, Text } from 'react-native-paper';
import { View } from 'react-native';
import React, { useMemo } from "react";
import { PlayerAvatar } from "./PlayerAvatar";
import { useNavigation } from '@react-navigation/native';

export enum PlayerGender {
  MALE,
  FEMALE
}

export interface PlayerCardProps {
  name: string;
  gear: number;
  level: number;
  genderChanged?: boolean;
  gender: PlayerGender;
}



export function PlayerCard(props: PlayerCardProps) {
  const navigation = useNavigation();

  return (
    <Card onPress={() => { navigation.navigate({name: 'Player'}) }}>
      <Card.Title
        left={(p) => <PlayerAvatar {...p} name={props.name}/>}
        right={(p) => <View style={{display: 'flex', flexDirection: 'row', gap: 8, marginRight: 12}}>
          {props.genderChanged ? <List.Icon icon="swap-horizontal"/> : undefined}
          <List.Icon icon={props.gender === PlayerGender.MALE ? 'gender-male' : 'gender-female'}/>
        </View>}
        title={props.name}/>
      <Card.Content>
        <View style={{display: 'flex', flexDirection: 'row'}}>
          <View style={{flex: 1, alignItems: 'flex-start'}}>
            <View style={{display: 'flex', flexDirection: 'row', gap: 8}}>
              <List.Icon icon="chevron-double-up" />
              <Text>{props.level}</Text>
            </View>
          </View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <View style={{display: 'flex', flexDirection: 'row', gap: 8}}>
              <List.Icon icon="sword" />
              <Text>{props.gear}</Text>
            </View>
          </View>
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <View style={{display: 'flex', flexDirection: 'row', gap: 8}}>
              <List.Icon icon="sword-cross" />
              <Text>{props.level+props.gear}</Text>
            </View>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}

export default PlayerCard;
