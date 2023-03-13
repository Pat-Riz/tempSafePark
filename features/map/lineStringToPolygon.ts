interface LineString {
  type: "LineString";
  coordinates: number[][];
}

interface Polygon {
  type: "Polygon";
  coordinates: number[][][];
}

interface Feature {
  type: "Feature";
  geometry: LineString | Polygon;
  properties: {
    [key: string]: any;
  };
}

interface GeoJson {
  type: "FeatureCollection";
  features: Feature[];
}

function lineStringToPolygon(feature: Feature): Feature {
  if (feature.geometry.type === "LineString") {
    return {
      ...feature,
      geometry: {
        type: "Polygon",
        coordinates: [
          [...feature.geometry.coordinates, feature.geometry.coordinates[0]],
        ],
      },
    };
  } else {
    return feature;
  }
}

export default lineStringToPolygon;
