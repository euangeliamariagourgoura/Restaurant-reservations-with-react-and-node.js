import React, { useContext } from 'react';
import { View } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';

export default function ProfileScreen({ navigation }) {
    const { user, logout } = useContext(AuthContext);

    return (
        <View style={{ padding: 20 }}>
            <Card style={{ marginBottom: 20 }}>
                <Card.Content>
                    <Text variant="titleLarge">Hello, {user.username}</Text>
                    <Text>{user.email}</Text>
                </Card.Content>
            </Card>

            <Button mode="contained" onPress={() => navigation.navigate('EditProfile')} style={{ marginBottom: 10 }}>
                Edit Profile
            </Button>

            <Button mode="outlined" onPress={logout} textColor="red">
                Logout
            </Button>
        </View>
    );
}