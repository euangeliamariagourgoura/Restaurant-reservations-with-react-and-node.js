import React, { useEffect, useState, useContext } from 'react';
import { FlatList } from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator } from 'react-native-paper';
import { API_BASE } from '../api/client';
import { AuthContext } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RestaurantListScreen({ navigation }) {
    const { token } = useContext(AuthContext);
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRestaurants = async () => {
        try {
            const res = await fetch(`${API_BASE}/restaurants`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setRestaurants(data);
        } catch (err) {
            console.error('Failed to fetch restaurants:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRestaurants();
    }, []);

    if (loading) return <ActivityIndicator animating style={{ marginTop: 40 }} />;

    return (
        <FlatList
            contentContainerStyle={{ padding: 10 }}
            data={restaurants}
            keyExtractor={item => item.restaurant_uuid}
            renderItem={({ item }) => (
                <Card
                    style={{ marginBottom: 12 }}
                    onPress={() => navigation.navigate('RestaurantDetail', { restaurant: item })}
                >
                    <Card.Content>
                        <Title>{item.name}</Title>
                        <Paragraph>{item.address}</Paragraph>
                    </Card.Content>
                </Card>
            )}
        />
    );
}