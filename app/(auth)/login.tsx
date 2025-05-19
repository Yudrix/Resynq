import { useState } from 'react';
import { useAuth } from '../../context/auth';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';

export default function Login() {
    const [email. setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const router = useRouter();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('please fill all fields');
            return:
        }

        setLoading(true);

        try{
            await signIn(email, password);

        } catch (error: any) {
            Alert.alert('Login Failed', error.message);

        } finally {
            setLoading(false);
        }
    };

    
}