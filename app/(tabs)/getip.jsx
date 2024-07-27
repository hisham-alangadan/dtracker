import { useState } from "react";
import { Link } from "expo-router";
import { View, Text, TextInput, Button, Pressable } from "react-native";


export default function GetIP() {

    const [ip, setip] = useState('');

    console.log("ip : " + ip)

    // function onChangeIP(ip) {
    //     console.log(ip + "-------------------------------------------------------")
    //     setip(ip.value)
    // }

    return (
        <View className="flex-1 items-center justify-center">
            <Text>Enter the IP address of the server: </Text>
            <TextInput value={ip} onChangeText={(value) => setip(value)} placeholder="0.0.0.0" keyboardType="numeric" className="h-10 w-1/2 border-2 rounded-md border-red-500 p-2" />
            <Link href={{
                pathname: '\client',
                params: { ip }
            }}>
                <Text>heh</Text>
                <Text>{ip}</Text>
            </Link>
        </View>
    )
}