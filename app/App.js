import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './context/AuthContext';
import AppNavigator from './navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
    return (
        <AuthProvider>
            <SafeAreaProvider>
                <PaperProvider>
                    <AppNavigator />
                </PaperProvider>
            </SafeAreaProvider>
        </AuthProvider>
    );
}
