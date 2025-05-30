import React, { useState, useContext, useCallback } from 'react';
import {
    View,
    ScrollView,
    Modal,
    Alert,
    Platform,
    TouchableOpacity
} from 'react-native';
import {
    Card,
    Text,
    Paragraph,
    ActivityIndicator,
    Button,
    TextInput
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import { API_BASE } from '../api/client';
import { AuthContext } from '../context/AuthContext';
import dayjs from '../utils/dayjsConfig';

export default function ReservationsScreen() {
    const { user, token } = useContext(AuthContext);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selected, setSelected] = useState(null);
    const [newDate, setNewDate] = useState(dayjs());
    const [guests, setGuests] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const fetchReservations = async () => {
        try {
            const res = await fetch(`${API_BASE}/reservations?user_id=${user.user_id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            const sorted = data.sort((a, b) => {
                if (a.status === 'cancelled' && b.status !== 'cancelled') return 1;
                if (a.status !== 'cancelled' && b.status === 'cancelled') return -1;
                return new Date(a.reservation_datetime) - new Date(b.reservation_datetime);
            });
            setReservations(sorted);
        } catch (err) {
            console.error('Failed to fetch reservations:', err);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchReservations();
        }, [])
    );

    const openEditModal = (item) => {
        if (item.status === 'cancelled') return;
        setSelected(item);
        setNewDate(dayjs(item.reservation_datetime));
        setGuests(item.guests.toString());
    };

    const saveChanges = async () => {
        try {
            const formattedLocal = newDate.format('YYYY-MM-DD HH:mm:ss'); // store exactly what user sees
            const res = await fetch(`${API_BASE}/reservations/${selected.reservation_uuid}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    reservation_datetime: formattedLocal,
                    guests: parseInt(guests, 10)
                })
            });

            if (!res.ok) throw new Error('Update failed');
            Alert.alert('Success', 'Reservation updated');
            setSelected(null);
            fetchReservations();
        } catch (err) {
            Alert.alert('Error', err.message);
        }
    };

    const confirmCancellation = () => {
        Alert.alert('Confirm', 'Are you sure you want to cancel this reservation?', [
            { text: 'No', style: 'cancel' },
            {
                text: 'Yes',
                style: 'destructive',
                onPress: cancelReservation
            }
        ]);
    };

    const cancelReservation = async () => {
        try {
            const res = await fetch(`${API_BASE}/reservations/${selected.reservation_uuid}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'cancelled' })
            });

            if (!res.ok) throw new Error('Cancellation failed');
            Alert.alert('Cancelled', 'Reservation cancelled');
            setSelected(null);
            fetchReservations();
        } catch (err) {
            Alert.alert('Error', err.message);
        }
    };

    const handleDateChange = (event, date) => {
        setShowDatePicker(false);
        if (event.type === 'set' && date) {
            const updated = dayjs(date).hour(newDate.hour()).minute(newDate.minute());
            setNewDate(updated);
            setShowTimePicker(true);
        }
    };

    const handleTimeChange = (event, time) => {
        setShowTimePicker(false);
        if (event.type === 'set' && time) {
            const updated = newDate
                .hour(dayjs(time).hour())
                .minute(dayjs(time).minute());
            setNewDate(updated);
        }
    };

    if (loading) return <ActivityIndicator animating style={{ marginTop: 40 }} />;

    return (
        <ScrollView contentContainerStyle={{ padding: 10 }}>
            {reservations.length === 0 ? (
                <Text>No reservations found.</Text>
            ) : (
                reservations.map((item) => (
                    <TouchableOpacity key={item.reservation_uuid} onPress={() => openEditModal(item)}>
                        <Card
                            style={{
                                marginBottom: 12,
                                backgroundColor: item.status === 'cancelled' ? '#eee' : 'white'
                            }}
                        >
                            <Card.Content>
                                <Text variant="titleMedium">{item.restaurant.name}</Text>
                                <Paragraph>{dayjs(item.reservation_datetime).format('DD MMM YYYY, HH:mm')}</Paragraph>
                                <Paragraph>Status: {item.status} • Guests: {item.guests}</Paragraph>
                            </Card.Content>
                        </Card>
                    </TouchableOpacity>
                ))
            )}

            <Modal visible={!!selected} animationType="slide">
                <View style={{ padding: 20, flex: 1 }}>
                    <Text variant="titleMedium" style={{ marginBottom: 10 }}>Edit Reservation</Text>

                    <Button onPress={() => setShowDatePicker(true)} mode="outlined" style={{ marginBottom: 10 }}>
                        Pick Date & Time
                    </Button>
                    <Text style={{ marginBottom: 10 }}>{newDate.format('DD MMM YYYY, HH:mm')}</Text>

                    {showDatePicker && (
                        <DateTimePicker
                            value={newDate.toDate()}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'inline' : 'default'}
                            onChange={handleDateChange}
                        />
                    )}

                    {showTimePicker && (
                        <DateTimePicker
                            value={newDate.toDate()}
                            mode="time"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={handleTimeChange}
                        />
                    )}

                    <TextInput
                        label="Guests"
                        value={guests}
                        onChangeText={setGuests}
                        keyboardType="numeric"
                        mode="outlined"
                        style={{ marginBottom: 10 }}
                    />

                    <Button mode="contained" onPress={saveChanges} style={{ marginBottom: 10 }}>
                        Save Changes
                    </Button>
                    <Button mode="outlined" onPress={confirmCancellation} textColor="red" style={{ marginBottom: 10 }}>
                        Cancel Reservation
                    </Button>
                    <Button onPress={() => setSelected(null)}>Close</Button>
                </View>
            </Modal>
        </ScrollView>
    );
}
