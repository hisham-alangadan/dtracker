import { View, Text } from "react-native";
import { Link } from "expo-router";

export default function Index() {
    return (
        <View className="flex-1 items-center justify-center">
            <Text className="text-3xl">Hello there</Text>
            <Link href="\client">Client</Link>
        </View>
    )
}