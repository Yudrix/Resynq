import { useState } from 'react';
import { useAuth } from '../../context/auth';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword]= useState('');
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();
    const router = useRouter();

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert('All fiels are required');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Password must be at least 6 charachters long');
            return;
        }

        setLoading(true);

        try {
          await signUp(name, email, password);

        } catch (error: any) {
            Alert.alert('Registration failed', error.message);

        } finally {
            setLoading(false);
        }
   };

   
} 