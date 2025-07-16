// frontend/screens/LoginScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { LoginScreenProps } from '../types/navigation';
import LoginForm from '../components/Auth/LoginForm';

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const handleLoginSuccess = (userClass: string) => {
    // Navigate to the main app or class selection screen
    // You can pass the userClass to the next screen
    navigation.navigate('ClassSelection', { userClass });
  };

  const handleNavigateToSignup = () => {
    navigation.navigate('Signup');
  };

  return (
    <View style={styles.container}>
      <LoginForm 
        onLoginSuccess={handleLoginSuccess}
        onNavigateToSignup={handleNavigateToSignup}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
});

export default LoginScreen;