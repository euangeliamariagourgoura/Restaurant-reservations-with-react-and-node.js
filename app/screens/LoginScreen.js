import React, { useState, useContext } from 'react';
import { View } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
    const { login } = useContext(AuthContext);
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const theme = useTheme();

    const handleLogin = async () => {
        try {
            await login(identifier, password);
        } catch (err) {
            // setError('Login failed. Please check your credentials.');
            setError(err.message);
        }
    };

    return (
        <View style={{ padding: 20, justifyContent: 'center', flex: 1 }}>
            <Text variant="headlineMedium" style={{ marginBottom: 20, color: theme.colors.primary }}>
                Welcome Back
            </Text>
            <TextInput
                label="Email or Username"
                value={identifier}
                onChangeText={setIdentifier}
                autoCapitalize="none"
                mode="outlined"
                style={{ marginBottom: 12 }}
            />
            <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                mode="outlined"
                right={
                    <TextInput.Icon
                        icon={showPassword ? 'eye-off' : 'eye'}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }
                style={{ marginBottom: 12 }}
            />

            <Button mode="contained" onPress={handleLogin} style={{ marginBottom: 16 }}>
                Login
            </Button>
            
            {error ? <Text style={{ color: theme.colors.error, marginTop: 10, marginBottom: 10 }}>{error}</Text> : null}

            <Button mode="text" onPress={() => navigation.navigate('Register')}>
                Don't have an account? Register
            </Button>
        </View>
    );
}