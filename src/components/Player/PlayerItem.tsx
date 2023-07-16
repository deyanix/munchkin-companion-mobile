import React from 'react';
import { Avatar, List, Text } from 'react-native-paper';
import { View } from 'react-native';

export function PlayerItem() {
  return <List.Item
    title="Michał Janiak"
    left={() => <Avatar.Text label="MJ" size={36} style={{marginLeft: 16}}/>}
    right={() => (
      <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8}}>
        <List.Icon icon="chevron-double-up"/>
        <Text style={{fontSize: 18}}>4</Text>
        <List.Icon icon="sword"/>
        <Text style={{fontSize: 18}}>5</Text>
      </View>
    )}
  />;
}
