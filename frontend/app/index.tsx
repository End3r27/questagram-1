import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Page() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏰 QUESTAGRAM 🏰</Text>
      <Text style={styles.subtitle}>Welcome, Adventurer!</Text>
      <Text style={styles.instruction}>Your epic journey begins here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#ccc',
    marginBottom: 10,
    textAlign: 'center',
  },
  instruction: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});