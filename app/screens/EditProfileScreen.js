import React, { useState, useContext } from 'react';
import { View, Alert } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import { API_BASE } from '../api/client';

export default function EditProfileScreen({ navigation }) {
    const { user, token, setUser } = useContext(AuthContext);
    const [username, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const theme = useTheme();

    const handleSave = async () => {
        if (!username || !email) {
            return setError('Username and email are required');
        }

        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/users/${user.user_uuid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ username, email })
            });

            if (!res.ok) throw new Error('Update failed');
            const updatedUser = await res.json();
            setUser(updatedUser);
            Alert.alert('Success', 'Profile updated');
            navigation.goBack();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text variant="headlineSmall" style={{ marginBottom: 20 }}>
                Edit Profile
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
                keyboardType="email-address"
                mode="outlined"
                style={{ marginBottom: 10 }}
            />

            {error ? <Text style={{ color: theme.colors.error }}>{error}</Text> : null}

            <Button mode="contained" onPress={handleSave} loading={loading} disabled={loading}>
                Save
            </Button>
        </View>
    );
}