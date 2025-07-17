// frontend/components/Auth/LoginForm.tsx
import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { apiService } from '../../services/api';

const { width: screenWidth } = Dimensions.get('window');

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
      <View style={styles.header}>
        <Text style={styles.title}>🏰 Welcome Back!</Text>
        <Text style={styles.subtitle}>Enter the realm of adventure</Text>
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
          autoCorrect={false}
          editable={!loading}
          returnKeyType="next"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
          returnKeyType="done"
          onSubmitEditing={handleLogin}
        />
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0066cc" />
            <Text style={styles.loadingText}>Entering the realm...</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>🗝️ Enter Realm</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={styles.signupButton} 
          onPress={onNavigateToSignup}
          disabled={loading}
        >
          <Text style={styles.signupButtonText}>
            New adventurer? Create your character
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  input: {
    height: 56,
    borderColor: '#444',
    borderWidth: 2,
    marginBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    color: '#fff',
    fontSize: 16,
  },
  error: {
    color: '#ff4444',
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 14,
    backgroundColor: '#2a1a1a',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    color: '#0066cc',
    marginTop: 12,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    minHeight: 56,
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#444',
    minHeight: 56,
    justifyContent: 'center',
  },
  signupButtonText: {
    color: '#ccc',
    fontSize: 16,
  },
});

export default LoginForm;