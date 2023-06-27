import React, { useMemo } from "react";
import { Avatar, AvatarTextProps } from "react-native-paper";

export interface PlayerAvatarProps extends Omit<AvatarTextProps, 'label'> {
  name: string;
}

export function PlayerAvatar(props: PlayerAvatarProps): React.JSX.Element {
  const avatarColor = useMemo(() => HSLtoString(generateHSL(props.name)), [props.name])
  const avatarLabel = useMemo(() => props.name
    .trim()
    .split(' ')
    .map(n => n.trim())
    .filter(n => n.length > 0)
    .slice(0, 2)
    .map(n => n.at(0))
    .join(''), [props.name]);

  return <Avatar.Text {...props} label={avatarLabel} style={{backgroundColor: avatarColor}} />
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
const generateHSL = (name: string): HSL => {
  const hash = getHashOfString(name);
  const h = normalizeHash(hash, 0, 360);
  const s = normalizeHash(hash, 45, 75);
  const l = normalizeHash(hash, 60, 90);
  return [h, s, l];
};

const HSLtoString = (hsl: HSL) => {
  return `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
};
