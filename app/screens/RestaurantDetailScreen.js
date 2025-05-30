import React, { useState, useContext } from 'react';
import { View, Platform, Alert } from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { API_BASE } from '../api/client';
import { AuthContext } from '../context/AuthContext';
import dayjs from '../utils/dayjsConfig';

export default function RestaurantDetailScreen({ route, navigation }) {
    const { restaurant } = route.params;
    const { user, token } = useContext(AuthContext);
    const theme = useTheme();

    const [guests, setGuests] = useState('2');
    const [datetime, setDatetime] = useState(dayjs());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (event.type === 'set' && selectedDate) {
            const updated = dayjs(selectedDate)
                .hour(datetime.hour())
                .minute(datetime.minute());
            setDatetime(updated);
            if (Platform.OS === 'android') setShowTimePicker(true);
        }
    };

    const onTimeChange = (event, selectedTime) => {
        setShowTimePicker(false);
        if (event.type === 'set' && selectedTime) {
            const updated = datetime
                .hour(dayjs(selectedTime).hour())
                .minute(dayjs(selectedTime).minute());
            setDatetime(updated);
        }
    };

    const makeReservation = async () => {
        try {
            const formattedDate = datetime.format('YYYY-MM-DD HH:mm:ss'); // stored as-is
            const res = await fetch(`${API_BASE}/reservations`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: user.user_id,
                    restaurant_id: restaurant.restaurant_id,
                    reservation_datetime: formattedDate,
                    guests: parseInt(guests, 10)
                })
            });

            if (!res.ok) throw new Error('Reservation failed');

            Alert.alert('Success', 'Reservation created!', [
                {
                    text: 'OK',
                    onPress: () => {
                        navigation.navigate('MainTabs', { screen: 'Reservations' });
                    }
                }
            ]);
        } catch (err) {
            Alert.alert('Error', err.message);
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text variant="titleLarge">{restaurant.name}</Text>
            <Text style={{ marginBottom: 10 }}>{restaurant.address}</Text>

            <Button onPress={() => setShowDatePicker(true)} mode="outlined" style={{ marginBottom: 10 }}>
                Pick Date & Time
            </Button>
            <Text style={{ marginBottom: 10 }}>Selected: {datetime.format('DD MMM YYYY, HH:mm')}</Text>

            {showDatePicker && (
                <DateTimePicker
                    value={datetime.toDate()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={onDateChange}
                />
            )}

            {showTimePicker && (
                <DateTimePicker
                    value={datetime.toDate()}
                    mode="time"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onTimeChange}
                />
            )}

            <TextInput
                label="Number of Guests"
                value={guests}
                onChangeText={setGuests}
                keyboardType="numeric"
                mode="outlined"
                style={{ marginBottom: 10 }}
            />

            <Button mode="contained" onPress={makeReservation}>
                Reserve
            </Button>
        </View>
    );
}
