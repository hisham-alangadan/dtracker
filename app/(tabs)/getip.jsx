import { Link } from "expo-router";
import { useState } from "react";
import { View, Text, TextInput, Button, Pressable } from "react-native";


export default function GetIP() {

    const [ip, setip] = useState('0.0.0.0');

    return (
        <View className="flex-1 items-center justify-center">
            <Text>Enter the IP address of the server: </Text>
            <TextInput value={ip} onChange={setip} keyboardType="numeric" className="h-10 w-1/2 border-2 rounded-md border-red-500 p-2" />
            <Link href={{
                pathname: '\client',
                params: { ip }
            }}>
                <Text>heh</Text>
            </Link>
        </View>
    )
}