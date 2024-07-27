import { useEffect, useState } from "react"
import { View, Text, Switch, Platform } from "react-native"
import { useLocalSearchParams } from "expo-router";
import * as Location from "expo-location";
import dgram from "react-native-udp";
import * as Network from "expo-network";

export default function Client() {

    const { ip } = useLocalSearchParams();
    // console.log(ip)

    const [location, setLocation] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [switchEnabled, setSwitchEnabled] = useState(true);
    const [localip, setLocalip] = useState('');

    function newSocket() {
        const socket = dgram.createSocket('udp4');

        console.log("sending to " + ip)

        socket.bind(12345)

        socket.once('listening', function () {
            socket.send('Hello World!', undefined, undefined, 12345, ip, function (err) {
                if (err) throw err
            })
            console.log("sent to " + ip)
        })
    }

    async function getIPAddress() {
        let ipaddr = await Network.getIpAddressAsync();
        setLocalip(ipaddr)
        console.log(ipaddr)
    }

    function handleSwitchValueChange() {
        if (switchEnabled === true) {
            // console.log("interval cleared b4 " + intervalID)
            clearInterval(intervalID);
            // console.log("interval cleared af " + intervalID)
            setErrorMsg("Location tracking off")
        }
        else {
            intervalID = setInterval(getCurrentLocation, 1000);
            // console.log("interval set " + intervalID)
            setErrorMsg("Location tracking on");
        }

        setSwitchEnabled(!switchEnabled);
    }

    async function getCurrentLocation() {
        if (Platform.OS !== 'android') {
            setErrorMsg("Oops, this will only work on Android devices. :-(");
            return;
        }

        let { status } = await Location.getForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg("Permission to access location was denied.");
            return;
        }

        let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation });
        setLocation(location)

        setLatitude(location.coords.latitude)
        setLongitude(location.coords.longitude)

    }

    useEffect(() => {
        getIPAddress()
        newSocket()
        intervalID = setInterval(getCurrentLocation, 500);
        // console.log("interval set " + intervalID)
        setErrorMsg("Location tracking on");
    }, [])


    return (
        <View className="flex-1 items-center justify-center">
            <Text className="text-red-700 text-xl">{errorMsg}</Text>
            <Text className="text-red-700 text-xl">sent ip: {ip === '' ? "Did not recieve" : ip}</Text>
            <Text className="text-red-700 text-xl">ip: {localip === '' ? "loading..." : localip}</Text>
            <Text>Hi</Text>
            <Switch value={switchEnabled} onValueChange={handleSwitchValueChange} />
            <Text>Latitude: {latitude === '' ? "waiting for signal" : latitude}</Text>
            <Text>Longitude: {longitude === '' ? "waiting for signal" : longitude}</Text>
        </View>
    )
}