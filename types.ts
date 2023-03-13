export type GeoJson = {
  type: string;
  features: {
    type: string;
    geometry: {
      type: string;
      coordinates: Array<number>;
    };
    properties: {
      [key: string]: any;
    };
  }[];
};

export type Location = {
  coords: {
    latitude: number;
    longitude: number;
  };
};
