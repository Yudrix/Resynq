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

   return (
        <View className="flex-1 p-6 justify-center items-center bg-white">
            <Text className="text-3xl font-bold mb-4">Create Account</Text>
            <Text className="text-gray-600 mb-8">Sign up to resynq your life!</Text>

            <TextInput
                className="border border-gray-300 rounded-lg p-2 mb-4 w-full max-w-md"
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
            />

            <TextInput
                className="border border-gray-300 rounded-lg p-2 mb-4 w-full max-w-md"
                placeholder="Email"
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                className="border border-gray-300 rounded-lg p-2 mb-4 w-full max-w-md"
                placeholder="Password"
                value={password}
                onChangeText={setPassword} 
                secureTextEntry
            />

            <TouchableOpacity
                className="bg-blue-400 rounded-xl py-3 items-center max-w-md self-center w-full"
                onPress={handleRegister}
                disabled={loading} 
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white font-bold text-lg">Create Account</Text>
                )}
                </TouchableOpacity>  

                <TouchableOpacity
                className="items-center"
                onPress={() => router.push("/(auth)/login")}
                >
                    <Text className="text-blue-400">Already have an account? Log In</Text>
                </TouchableOpacity>       
        </View>

   );
} 