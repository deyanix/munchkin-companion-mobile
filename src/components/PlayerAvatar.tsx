/* eslint-disable no-bitwise */
import React, { useMemo } from 'react';
import { Avatar, AvatarTextProps } from 'react-native-paper';
import { MunchkinPlayer } from '../protocol/munchkin/game';

export interface PlayerAvatarProps extends Omit<AvatarTextProps, 'label'> {
  player: MunchkinPlayer;
}

export function PlayerAvatar(props: PlayerAvatarProps): React.JSX.Element {
  const avatarColor = useMemo(
    () => {
      const hash = Math.round(
        Math.sin(getHashOfString(props.player.name + props.player.id)) * 10000
      );
      const hsl = generateHSL(hash);
      return HSLtoString(hsl);
    },
    [props.player]
  );

  const avatarLabel = useMemo(() => [props.player.name, props.player.id].join(' ')
    .trim()
    .split(' ')
    .map(n => n.trim())
    .filter(n => n.length > 0)
    .slice(0, 2)
    .map(n => n.at(0))
    .join(''), [props.player]);

  return <Avatar.Text {...props} label={avatarLabel} style={{backgroundColor: avatarColor}} />;
}

const getHashOfString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);
  return hash;
};

const normalizeHash = (hash: number, min: number, max: number) => {
  return Math.floor((hash % (max - min)) + min);
};

type HSL = [number, number, number];
const generateHSL = (hash: number): HSL => {
  const h = normalizeHash(hash, 0, 360);
  const s = normalizeHash(hash, 45, 75);
  const l = normalizeHash(hash, 65, 70);
  return [h, s, l];
};

const HSLtoString = (hsl: HSL) => {
  return `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
};
