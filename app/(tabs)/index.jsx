import { View, Text } from "react-native";
import { Link } from "expo-router";

export default function Index() {
    return (
        <View className="flex-1 items-center justify-center">
            <Text className="text-3xl">Hello there</Text>
            <Link className="text-xl text-green-800" href="\getip">Client</Link>
            <Link className="text-xl text-blue-800" href="\tracker">Tracker</Link>
        </View>
    )
}