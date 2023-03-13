import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Details, Geojson, Marker, Region } from "react-native-maps";
import { LOCAL_API_URL } from "../../constants";
import { GeoJson } from "../../types";
import { getBounds } from "./getBounds";

interface Zone {
  name: string;
  // Add additional properties as needed
}
type Props = {
  zones: GeoJson;
  location: Location;
  mapType: string;
};

const MapScreen: React.FC = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mapType, setMapType] = useState<"standard" | "satellite">("standard");
  const [zones, setZones] = useState<GeoJson | null>(null);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [visibleZone, setVisibleZone] = useState<GeoJson | null>(null);
  const [viewport, setViewport] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();

    (async () => {
      try {
        const res = await fetch(LOCAL_API_URL);
        const json = await res.json();
        console.log("Fetched data correctly");

        // const polygonZones = convertZones(json);
        //@ts-ignore
        setZones(json);
      } catch (error) {
        console.log("Datafetch error: ", error);
      }
    })();
  }, []);

  const isZoomedInEnough = ({ latitudeDelta, longitudeDelta }: Region) => {
    return latitudeDelta < 0.01 && longitudeDelta < 0.01;
  };

  const handleRegionChange = (
    region: Region,
    details: Details
  ): void | undefined => {
    if (!zones || !isZoomedInEnough(region)) {
      return;
    }

    console.log("Region:", region);

    console.log("Bounds: ", getBounds(region));

    const { west, south, east, north } = getBounds(region);

    // Filter the GeoJSON features based on their location
    const visibleFeatures = zones!.features.filter((feature) => {
      const [lng, lat] = feature.geometry.coordinates;

      return lng >= west && lng <= east && lat >= south && lat <= north;
    });
    console.log("Visible features:", visibleFeatures);

    //Here we want to color the feature strokes depending on if we can park or not.
    setVisibleZone({
      type: "FeatureCollection",
      features: visibleFeatures,
    });
  };

  const toggleMapType = () => {
    if (mapType === "standard") {
      setMapType("satellite");
    } else {
      setMapType("standard");
    }
  };

  const handleZonePress = (event: {
    nativeEvent: { payload: GeoJSON.Feature<GeoJSON.Polygon, Zone> };
  }) => {
    console.log("CLICK EVENT", event);

    const feature = event.nativeEvent.payload;
    if (feature && feature.properties) {
      setSelectedZone(feature.properties.name);
    }
  };

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text>{errorMsg}</Text>
      </View>
    );
  } else if (!location) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          onRegionChangeComplete={handleRegionChange}
          region={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          mapType={mapType}
        >
          {visibleZone && (
            <Geojson
              //@ts-ignore
              geojson={visibleZone}
              strokeColor='#FF0000'
              fillColor='rgba(255,0,0,0.5)'
              strokeWidth={2}
              //@ts-ignore
              onPress={handleZonePress}
            />
          )}
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            pinColor='blue'
            title='Current Location'
          />
        </MapView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleMapType}>
            <MaterialIcons
              name={mapType === "standard" ? "satellite" : "map"}
              size={24}
              color='black'
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  button: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
  },
});

export default MapScreen;
