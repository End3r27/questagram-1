// frontend/components/Auth/LoginForm.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { apiService } from '../../services/api';

interface LoginFormProps {
  onLoginSuccess?: (userClass: string) => void;
  onNavigateToSignup?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onNavigateToSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Reset error message
    setError('');

    // Basic validation
    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      const response = await apiService.login({ username, password });
      
      Alert.alert('Success', response.message);
      
      // Call the success callback with user class if available
      if (onLoginSuccess && response.userClass) {
        onLoginSuccess(response.userClass);
      }
      
      // Clear form
      setUsername('');
      setPassword('');
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        editable={!loading}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />
      
      {loading ? (
        <ActivityIndicator size="large" color="#0066cc" style={styles.loader} />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}
      
      <Button 
        title="Don't have an account? Sign up" 
        onPress={onNavigateToSignup}
        color="#666"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  loader: {
    marginVertical: 20,
  },
});

export default LoginForm;