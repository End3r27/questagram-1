import React from 'react';
import { Text, Linking, TextProps } from 'react-native';

export function ExternalLink(props: TextProps & { href: string }) {
  return (
    <Text
      {...props}
      style={[{ color: 'blue', textDecorationLine: 'underline' }, props.style]}
      onPress={() => Linking.openURL(props.href)}
    >
      {props.children}
    </Text>
  );
}