// frontend/app/index.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');

    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful login
      setLoading(false);
      Alert.alert('Login Successful!', 'Welcome back, adventurer!', [
        { text: 'Continue', onPress: () => router.push('/class-selection') }
      ]);

    } catch (error) {
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  const handleSignup = () => {
    router.push('/signup');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🏰 QUESTAGRAM 🏰</Text>
        <Text style={styles.subtitle}>Begin Your Adventure</Text>
        <Text style={styles.tagline}>Where every post is a quest!</Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          editable={!loading}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />
        
        {loading ? (
          <ActivityIndicator size="large" color="#0066cc" style={styles.loader} />
        ) : (
          <>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.buttonText}>⚔️ Enter the Realm</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
              <Text style={styles.signupText}>🆕 Create New Character</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Join thousands of adventurers!</Text>
      </View>
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
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    // Use web-compatible text shadow
    ...(typeof window !== 'undefined' ? {
      textShadow: '2px 2px 5px rgba(0, 0, 0, 0.8)',
    } : {
      textShadowColor: '#000',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 5,
    }),
  },
  subtitle: {
    fontSize: 18,
    color: '#ccc',
    fontStyle: 'italic',
    marginBottom: 5,
  },
  tagline: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  input: {
    height: 50,
    borderColor: '#444',
    borderWidth: 2,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    color: '#fff',
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    // Use web-compatible shadow
    ...(typeof window !== 'undefined' ? {
      boxShadow: '0 4px 8px rgba(0, 102, 204, 0.3)',
    } : {
      shadowColor: '#0066cc',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
    }),
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupButton: {
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#666',
  },
  signupText: {
    color: '#ccc',
    fontSize: 16,
  },
  error: {
    color: '#ff4444',
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
    backgroundColor: '#331111',
    padding: 10,
    borderRadius: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#ff4444',
  },
  loader: {
    marginVertical: 20,
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
  },
  footerText: {
    color: '#666',
    fontSize: 12,
    fontStyle: 'italic',
  },
});