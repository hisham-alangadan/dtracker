import { useState } from "react"
import { View, Text, Switch, Platform } from "react-native"

export default function Client() {

    const [location, setLocation] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [switchEnabled, setSwitchEnabled] = useState(true);

    // intervalID = null;

    function handleSwitchValueChange() {
        if (switchEnabled === true) {
            intervalID ? clearInterval(intervalID) : null;
        }
        else {
            intervalID = setInterval(getCurrentLocation, 500);
        }

        setSwitchEnabled(!switchEnabled);
    }

    let i = 0;

    async function getCurrentLocation() {
        if (Platform.OS !== 'android') {
            setErrorMsg("Oops, this will only work on Android devices. :-(");
            return;
        }

        let { status } = await Location.requestForegroundPermissionAsync();
        if (status !== 'granted') {
            setErrorMsg("Permission to access location was denied.");
            return;
        }

        setErrorMsg(i);
        i++;
    }


    return (
        <View className="flex-1 items-center justify-center">
            <Text className="text-red-700 text-xl">{errorMsg}</Text>
            <Text>Hi</Text>
            <Switch value={switchEnabled} onValueChange={handleSwitchValueChange} />
        </View>
    )
}