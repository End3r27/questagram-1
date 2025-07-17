import React from 'react';
import { View, StyleSheet, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import LoginForm from '../components/Auth/LoginForm';
import { useAuth } from '../context/AuthContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const handleLoginSuccess = async (userClass: string) => {
    // Set user as logged in with class selection status
    await login({
      id: 'user-id', // In a real app, this would come from the API response
      username: 'username', // This would also come from the API response
      hasSelectedClass: !!userClass
    });
  };

  const handleNavigateToSignup = () => {
    router.push('/signup');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.formContainer}>
        <LoginForm 
          onLoginSuccess={handleLoginSuccess}
          onNavigateToSignup={handleNavigateToSignup}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
});