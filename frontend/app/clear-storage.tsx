import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function ClearStorage() {
  const router = useRouter();

  const clearQuestStorage = async () => {
    try {
      await AsyncStorage.removeItem('@questagram_quests');
      Alert.alert('Success', 'Quest storage cleared! Please restart the app.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to clear storage');
    }
  };

  const clearAllStorage = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert('Success', 'All storage cleared! Please restart the app.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to clear storage');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔧 Debug Tools</Text>
      
      <TouchableOpacity style={styles.button} onPress={clearQuestStorage}>
        <Text style={styles.buttonText}>Clear Quest Storage</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={clearAllStorage}>
        <Text style={styles.buttonText}>Clear All Storage</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  dangerButton: {
    backgroundColor: '#ff4444',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#666',
    marginTop: 20,
  },
  backText: {
    color: '#ccc',
    fontSize: 16,
  },
});