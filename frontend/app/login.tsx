import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import LoginForm from '../components/Auth/LoginForm';
import { useAuth } from '../context/AuthContext';

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
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <LoginForm 
          onLoginSuccess={handleLoginSuccess}
          onNavigateToSignup={handleNavigateToSignup}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: 20,
  },
});