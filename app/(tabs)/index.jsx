import { View, Text } from "react-native";
import { Link } from "expo-router";

export default function Index() {
    return (
        <View className="flex-1 items-center justify-center">
            <Text className="text-3xl">Well Hello there</Text>
            <Link className="text-xl text-green-800 max-h-10 flex-1" href="\getip">Client</Link>
            <Link className="text-xl text-blue-800 max-h-10 flex-1" href="\tracker">Tracker</Link>
            <Link className="text-xl text-green-800 max-h-10 flex-1" href="\track_self">Track Self</Link>
        </View>
    )
}