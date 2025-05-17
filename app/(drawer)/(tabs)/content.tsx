
import { View, Text } from "react-native";

export default function Home() {
    return (
    <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white text-3xl">
            CSS test
        </Text>
        <View className="bg-red-500 w-32 h-32 rounded-lg"/>
    </View>
  );
}