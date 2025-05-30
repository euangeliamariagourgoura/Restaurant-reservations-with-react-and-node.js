import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { API_BASE } from '../api/client';

export default function RegisterScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const theme = useTheme();

    const handleRegister = async () => {
        if (!username || !email || !password) {
            return setError('All fields are required.');
        }

        try {
            const res = await fetch(`${API_BASE}/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            if (!res.ok) throw new Error('Registration failed');
            Alert.alert('Success', 'You can now log in.');
            navigation.navigate('Login');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <View style={{ padding: 20, justifyContent: 'center', flex: 1 }}>
            <Text variant="headlineMedium" style={{ marginBottom: 20, color: theme.colors.primary }}>
                Create Account
            </Text>
            <TextInput
                label="Username"
                value={username}
                onChangeText={setUsername}
                mode="outlined"
                style={{ marginBottom: 10 }}
            />
            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                style={{ marginBottom: 10 }}
            />
            <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                mode="outlined"
                style={{ marginBottom: 10 }}
            />
            <Button mode="contained" onPress={handleRegister}>Register</Button>
            {error ? <Text style={{ color: theme.colors.error, marginTop: 10 }}>{error}</Text> : null}
        </View>
    );
}