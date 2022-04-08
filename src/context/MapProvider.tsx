import React, { FC, useContext, useState, createContext } from "react";

interface Context {
  mapIsReady: boolean;
  toggleMapReady: () => void;
};

const MapContext = createContext<Context | null>(null);

export const useMap = () => {
  return useContext(MapContext) as Context;
};

export const MapProvider: FC = ({ children }) => {
  const [mapIsReady, setMapIsReady] = useState(false);

  const toggleMapReady = () => {
    setMapIsReady((prev) => !prev);
  };

  const value: Context = {
    mapIsReady,
    toggleMapReady
  }

  return (
    <MapContext.Provider value={value}>
      { children }
    </MapContext.Provider>
  )    
}