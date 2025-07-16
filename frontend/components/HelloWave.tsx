import React from 'react';
import { Text, View } from 'react-native';

export function HelloWave() {
  return (
    <View style={{ alignItems: 'center', margin: 16 }}>
      <Text style={{ fontSize: 32 }}>👋</Text>
      <Text>Hello, Adventurer!</Text>
    </View>
  );
}