// frontend/components/Auth/SignupForm.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { apiService } from '../../services/api';

interface SignupFormProps {
  onSignupSuccess?: () => void;
  onNavigateToLogin?: () => void;
}

const classes = [
  { label: 'Choose your class...', value: '' },
  { label: 'Warrior - Sports & Fitness', value: 'warrior' },
  { label: 'Mage - Art & Education', value: 'mage' },
  { label: 'Rogue - Memes & Trends', value: 'rogue' },
  { label: 'Cleric - Support & Community', value: 'cleric' },
];

const SignupForm: React.FC<SignupFormProps> = ({ onSignupSuccess, onNavigateToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userClass, setUserClass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError('');

    // Validation
    if (!username || !password || !confirmPassword || !userClass) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const response = await apiService.signup({
        username,
        password,
        userClass,
      });

      Alert.alert('Success', response.message, [
        {
          text: 'OK',
          onPress: () => {
            // Clear form
            setUsername('');
            setPassword('');
            setConfirmPassword('');
            setUserClass('');
            
            // Call success callback
            if (onSignupSuccess) {
              onSignupSuccess();
            }
          },
        },
      ]);

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your Character</Text>
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
      
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        editable={!loading}
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={userClass}
          onValueChange={setUserClass}
          style={styles.picker}
          enabled={!loading}
        >
          {classes.map((cls) => (
            <Picker.Item key={cls.value} label={cls.label} value={cls.value} />
          ))}
        </Picker>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0066cc" style={styles.loader} />
      ) : (
        <Button title="Create Character" onPress={handleSignup} />
      )}
      
      <Button 
        title="Already have an account? Login" 
        onPress={onNavigateToLogin}
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
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  pickerContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  picker: {
    height: 40,
  },
  error: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
  loader: {
    marginVertical: 20,
  },
});

export default SignupForm;