import { useEffect, useState } from "react"
import { View, Text, Switch, Platform, Button } from "react-native"
import { useLocalSearchParams } from "expo-router";
import * as Location from "expo-location";
import dgram from "react-native-udp";
import * as Network from "expo-network";

const timeDelay = 2000;

export default function Client() {

    const { ip } = useLocalSearchParams();
    // console.log(ip)
    var time = 0;
    var prevtime = 0;
    var starttime;
    var totalDistance = 0;
    var prevlocation = {};

    const [location, setLocation] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [switchEnabled, setSwitchEnabled] = useState(true);
    const [localip, setLocalip] = useState('');

    function newSocket() {
        const socket = dgram.createSocket('udp4');

        socket.bind(12345)

        // socket.once('listening', function () {
        //     socket.send('Hello World!', undefined, undefined, 12345, ip, function (err) {
        //         if (err) throw err
        //     })
        //     console.log("sent to " + ip)
        // })
        console.log("sending first hello packet")
        socket.send('Hello World!', undefined, undefined, 12345, ip, function (err) {
            // if (err) throw err
        })
    }

    function sendLocation() {
        const socket = dgram.createSocket('udp4');
        socket.bind(12345)
        console.log("Sending: " + JSON.stringify(location))
        socket.send(JSON.stringify(location), undefined, undefined, 12345, ip, function (err) {
            // if (err) throw err
        })
    }

    function sendData() {
        if (prevtime === 0) {
            prevtime = Date.now();
            time = Date.now();
            starttime = Date.now();
            return;
        }
        prevtime = time;
        time = Date.now();
        if (!(location.coords || prevlocation.coords)) {
            return;
        }

        const distance = pythagoreanDistanceBetweenPoints(location.coords.latitude, location.coords.longitude, prevlocation.coords.latitude, prevlocation.coords.longitude);
        console.log("Distance" + distance);

        const instSpeed = (distance) / (time - prevtime);
        const avgSpeed = (totalDistance) / (time - starttime);

        var data = {
            "currlongitude": longitude,
            "currlatitude": latitude,
            "sentTime": Date.now(),
            "distanceCovered": distance,
            "instantaneousSpeed": instSpeed,
            "averageSpeed": avgSpeed
        };

        const socket = dgram.createSocket('udp4');
        socket.bind(12345)
        console.log("Sending: " + JSON.stringify(data))
        socket.send(JSON.stringify(data), undefined, undefined, 12345, ip, function (err) {
            // if (err) throw err
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
            clearInterval(locationIntervalID);
            // console.log("interval cleared af " + intervalID)
            setErrorMsg("Location tracking off")
        }
        else {
            intervalID = setInterval(getCurrentLocation, timeDelay);
            intervalID = setInterval(sendData, timeDelay);
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

        let locationnow = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation });
        prevlocation = location;
        setLocation(locationnow)

        setLatitude(location.coords.latitude)
        setLongitude(location.coords.longitude)

    }

    function pythagoreanDistanceBetweenPoints(lat1, lon1, lat2, lon2) {
        const R = 6371e3;
        const x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
        const y = (lat2 - lat1);
        const d = Math.sqrt(x * x + y * y) * R;
        return d;
    }

    useEffect(() => {
        getIPAddress()
        newSocket()
        intervalID = setInterval(getCurrentLocation, timeDelay);
        locationIntervalID = setInterval(sendData, timeDelay);
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
            <Button onPress={sendData} title="Send Location" />
        </View>
    )
}