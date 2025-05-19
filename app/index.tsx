import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function MainLandingPage() {
    const router = useRouter();
    
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
            </View>
        </View>
    );
}