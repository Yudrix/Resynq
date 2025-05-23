import { useState } from 'react';
import { useAuth } from '../../context/auth';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const router = useRouter();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('please fill all fields');
            return;
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

    return (
       <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-3xl font-bold mb-4">Namaste, welcome back!</Text>
        <Text className="text-gray-600 mb-8">Login to continue</Text>

        <TextInput 
         className="border border-gray-300 rounded-lg p-2 mb-4 w-full max-w-md"
         placeholder='E-mail'
         value={email}
         onChangeText={setEmail}
         keyboardType="email-address"
         autoCapitalize="none"
         />
        
        <TextInput 
         className="border border-gray-300 rounded-lg p-2 mb-4 w-full max-w-md"
         placeholder="password"
         value={password}
         onChangeText={setPassword}
         secureTextEntry />

         <TouchableOpacity className="bg-blue-400 rounded-xl py-3 items-center max-w-md self-center w-full"
         onPress={handleLogin}
         disabled={loading}>

            {loading ? (
                <ActivityIndicator color="white" />
            ) : (
                <Text className="text-white font-bold text-center">Log In</Text>
            )}
         </TouchableOpacity>

         <TouchableOpacity className="items-center"
          onPress={() => router.push("/(auth)/register")}
          >
            <Text className="text-blue-400">Don't have an account? Sign up</Text>
          </TouchableOpacity>

         </View> 
    )
}
export default Login;