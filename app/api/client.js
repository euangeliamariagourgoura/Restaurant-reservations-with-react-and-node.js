import { Platform } from 'react-native';

export const API_BASE =
    Platform.OS === 'android'
        ? 'http://10.0.2.2:4000/api'
        : 'http://localhost:4000/api';