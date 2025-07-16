import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SignupForm from '../components/Auth/SignupForm';

const SignupScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create an Account</Text>
            <SignupForm />
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
    title: {
        fontSize: 24,
        color: '#ffffff',
        marginBottom: 20,
    },
});

export default SignupScreen;