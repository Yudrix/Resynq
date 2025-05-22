import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../context/auth";

export default function MainLandingPage() {
    const router = useRouter();
    const { signInWithGoogle } = useAuth();

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();

        } catch (error) {
            console.error("Google Sign in error:", error);
        }
    };
    
    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Text className="text-3xl font-bold text-gray-800 mb-2">Resynq</Text>
            <Text className="text-lg text-gray-700 mb-10">Productivity at your fingertips.</Text>

            <View className="w-full px-10 space-y-4">
                <TouchableOpacity className="bg-blue-400 rounded-xl py-3 items-center max-w-md self-center w-full"
                onPress={() => router.push("/(auth)/register")}> 

                <Text className="text-white font-bold text-lg">Sign In</Text>              
                </TouchableOpacity>

                <TouchableOpacity className="bg-blue-400 rounded-xl py-3 items-center max-w-md self-center w-full"
                onPress={() => router.push("/(auth)/login")}>
                    <Text className="text-white font-bold text-lg">Log In</Text>
                </TouchableOpacity>

                <TouchableOpacity className="bg-white border border-gray-300 rounded-xl py-3 px-4 items-center justify-center self-center max-w-md w-full flex-row"
                onPress={handleGoogleSignIn}>
                    <Image source={require('./assets/google(1).png')} style={{ width: 24, height: 24, marginRight: 8 }}
                    />
                    <Text className="text-gray-700 font-bold text-lg">Continue with Google</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}