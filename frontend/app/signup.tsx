// frontend/app/signup.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
// Remove Picker import for now
import { router } from 'expo-router';

const classes = [
  { label: 'Choose your class...', value: '' },
  { label: '⚔️ Warrior - Sports & Fitness', value: 'warrior' },
  { label: '🔮 Mage - Art & Education', value: 'mage' },
  { label: '🗡️ Rogue - Memes & Trends', value: 'rogue' },
  { label: '✨ Cleric - Support & Community', value: 'cleric' },
];

const SignupScreen = () => {
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
      // Simulate signup process
      // Replace with actual API call later: apiService.signup({ username, password, userClass })
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setLoading(false);
      Alert.alert(
        'Character Created!', 
        `Welcome to Questagram, ${username}! Your ${userClass} adventure begins now.`,
        [
          {
            text: 'Start Adventure',
            onPress: () => router.push('/class-selection')
          }
        ]
      );

    } catch (error) {
      setError('Signup failed. Please try again.');
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Your Character</Text>
        <Text style={styles.subtitle}>Join the Adventure</Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Choose Username"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          editable={!loading}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Create Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#999"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          editable={!loading}
        />

        {/* Class Selection using Touchable Buttons */}
        <Text style={styles.classLabel}>Choose Your Class:</Text>
        <View style={styles.classButtons}>
          {classes.filter(cls => cls.value !== '').map((cls) => (
            <TouchableOpacity
              key={cls.value}
              style={[
                styles.classButton,
                userClass === cls.value && styles.selectedClassButton
              ]}
              onPress={() => setUserClass(cls.value)}
              disabled={loading}
            >
              <Text style={[
                styles.classButtonText,
                userClass === cls.value && styles.selectedClassButtonText
              ]}>
                {cls.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0066cc" style={styles.loader} />
        ) : (
          <>
            <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
              <Text style={styles.buttonText}>Create Character</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.backButton} onPress={handleBackToLogin}>
              <Text style={styles.backText}>Back to Login</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
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
  pickerContainer: {
    borderColor: '#444',
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: '#2a2a2a',
    marginBottom: 15,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#fff',
  },
  classLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  classButtons: {
    marginBottom: 15,
  },
  classButton: {
    backgroundColor: '#2a2a2a',
    borderColor: '#444',
    borderWidth: 2,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  selectedClassButton: {
    backgroundColor: '#0066cc',
    borderColor: '#0088ff',
  },
  classButtonText: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
  },
  selectedClassButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  signupButton: {
    backgroundColor: '#00cc66',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#666',
  },
  backText: {
    color: '#ccc',
    fontSize: 16,
  },
  error: {
    color: '#ff4444',
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
  },
  loader: {
    marginVertical: 20,
  },
});

export default SignupScreen;