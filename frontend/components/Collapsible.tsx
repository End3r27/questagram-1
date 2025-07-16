import React from 'react';
import { View, ViewProps } from 'react-native';

export function Collapsible(props: ViewProps) {
  return <View {...props}>{props.children}</View>;
}