import { Region } from "react-native-maps";

interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export const getBounds = ({
  latitude,
  latitudeDelta,
  longitude,
  longitudeDelta,
}: Region): Bounds => {
  const north = latitude + latitudeDelta / 2;
  const south = latitude - latitudeDelta / 2;
  const east = longitude + longitudeDelta / 2;
  const west = longitude - longitudeDelta / 2;
  return { north, south, east, west };
};
