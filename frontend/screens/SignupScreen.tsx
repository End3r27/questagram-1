// frontend/screens/SignupScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { SignupScreenProps } from '../types/navigation';
import SignupForm from '../components/Auth/SignupForm';

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const handleSignupSuccess = () => {
    // Navigate back to login after successful signup
    navigation.navigate('Login');
  };

  const handleNavigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <SignupForm 
        onSignupSuccess={handleSignupSuccess}
        onNavigateToLogin={handleNavigateToLogin}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1a1a1a',
  },
});

export default SignupScreen;