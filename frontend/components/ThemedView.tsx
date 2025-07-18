import React from 'react';
import { View, ViewProps } from 'react-native';

export function ThemedView(props: ViewProps) {
  return <View {...props}>{props.children}</View>;
}