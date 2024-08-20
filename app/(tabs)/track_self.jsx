import * as Location from "expo-location";
import { useState } from "react";
import { View, Text, Platform, Switch } from "react-native";
import { getDistance } from "geolib";

const timeDelay = 3000;

function TrackSelf() {
    const [location, setLocation] = useState('')
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')
    const [switchEnabled, setSwitchEnabled] = useState(false)
    const [errmsg, setErrmsg] = useState('')
    const [keeptrack, setKeepTrack] = useState(0)
    const [intervalid, setIntervalid] = useState(0)
    const [distance, setDistance] = useState(0)

    var keeptrackvar = 0;
    var prevlocation = {};
    var intervalID = 0;
    var distancevar = 0;

    async function getCurrentLocation() {
        console.log("hi")
        if (Platform.OS !== "android") {
            setErrmsg("Oops! This will only work on andorid devices.")
            return;
        }

        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrmsg("Permission to access the device location was denied.");
            return;
        }

        let currentlocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation });

        location === '' ? null : prevlocation = location;

        setLocation(currentlocation)

        setLatitude(currentlocation.coords.latitude)
        setLongitude(currentlocation.coords.longitude)

        keeptrackvar += 1;
        setKeepTrack(keeptrackvar)

        // var instdistance = pythagoreanDistanceBetweenPoints(currentlocation.coords.latitude, currentlocation.coords.longitude, prevlocation.coords.latitude, prevlocation.coords.longitude);
        // var instdistance = distance_moveabletypescripts(currentlocation.coords.latitude, currentlocation.coords.longitude, prevlocation.coords.latitude, prevlocation.coords.longitude);
        const instdistance = getDistance({ latitude: currentlocation.coords.latitude, longitude: currentlocation.coords.longitude }, { latitude: prevlocation.coords.latitude, longitude: prevlocation.coords.longitude }, accuracy = 0.01)

        console.log("instdistance: " + instdistance)
        distancevar += instdistance;
        console.log("distancevar: " + distancevar)
        setDistance(distancevar)
    }

    function handleSwitch() {
        if (switchEnabled === true) {
            console.log("disabling" + intervalid)
            clearInterval(intervalid)
        }
        else {
            intervalID = setInterval(getCurrentLocation, timeDelay);
            setIntervalid(intervalID)
            console.log("enabling" + intervalID)
            // getCurrentLocation()
        }
        setSwitchEnabled(!switchEnabled)
    }

    return (
        <View className="flex-1 items-center justify-center">
            <Text className="text-red-700 text-xl">{errmsg}</Text>
            <Text>{location === '' ? "Getting location..." : null}</Text>
            <Text>Latitude: {latitude === '' ? "Getting location..." : latitude}</Text>
            <Text>Longitude: {longitude === '' ? "Getting location..." : longitude}</Text>
            <Text>KeepTrack: {keeptrack}</Text>
            <Text>Distance Covered: {distance}</Text>
            <Switch value={switchEnabled} onValueChange={handleSwitch} />
        </View>
    )
}

export default TrackSelf;