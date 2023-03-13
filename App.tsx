import { StyleSheet } from "react-native";
import MapScreen from "./features/map/MapScreen";

export default function App() {
  console.log("Starting app");

  return (
    // <View style={styles.container}>
    //   <MapView style={styles.map} />
    // </View>
    <MapScreen />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flexBasis: "80%",
    width: "100%",
    height: "100%",
  },
});
