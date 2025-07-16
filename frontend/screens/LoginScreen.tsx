import React from 'react';
import { View, StyleSheet } from 'react-native';
import LoginForm from '../components/Auth/LoginForm';

const LoginScreen = () => {
    return (
        <View style={styles.container}>
            <LoginForm />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a1a', // Dark theme background
    },
});

export default LoginScreen;