import React from 'react';
import { Text, TextProps } from 'react-native';

export function ThemedText(props: TextProps & { type?: string }) {
  return <Text {...props}>{props.children}</Text>;
}