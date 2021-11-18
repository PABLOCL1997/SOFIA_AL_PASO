import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import SimpleMap from "../SimpleMap";
import Cta from "../Cta";
import * as SC from "./style"

declare var google: any;
declare var window: any;


type Props = {
  mapsLatLng: { [key: string]: number[] };
  mapsName: string[];
  mapsPolygons: {
    [key: string]: {
      lat: number;
      lng: number;
    }[][];
  };
  mapsZoom: { [key: string]: number };
};

export default function MapList({ mapsLatLng, mapsName, mapsPolygons, mapsZoom }: Props) {
  const [isCollapsed, setIsCollapsed] = useState(Array(mapsName.length).fill(true));
  const { t } = useTranslation();

  const changeCollapse = (index: number) => {
    const newCollapse = [...isCollapsed];
    newCollapse[index] = !newCollapse[index];
    setIsCollapsed(newCollapse);
  };

  const setLatLng = (latLng: number[], i: number) => {
    if (!latLng.length) return;

    window.maps[i].latitude = latLng[0] || -16.5207007;
    window.maps[i].longitude = latLng[1] || -68.194118;
  };

  const initMap = () => {
    Object.keys(mapsLatLng).forEach((cityName, i) => {
      window.maps[i] = {};
      setLatLng(mapsLatLng[cityName], i);
      const uluru = { lat: parseFloat(window.maps[i].latitude || -16.5207007), lng: parseFloat(window.maps[i].longitude || -68.194118) };
      const interval = setInterval(() => {
        if (!document.getElementsByClassName("gmap")[i] || !google) return;
        clearInterval(interval);
        window.maps[i].map = new google.maps.Map(document.getElementsByClassName("gmap")[i], {
          zoom: mapsZoom[cityName],
          center: { lat: parseFloat(window.maps[i].latitude), lng: parseFloat(window.maps[i].longitude) },
          disableDefaultUI: true,
          zoomControl: true,
          rotateControl: true,
        });
        mapsPolygons[cityName].map(
          (polygon) =>
            new google.maps.Polygon({
              map: window.maps[i].map,
              paths: polygon,
              strokeColor: "CornflowerBlue",
              strokeOpacity: 0.6,
              strokeWeight: 2,
              fillColor: "CornflowerBlue",
              fillOpacity: 0.2,
              clickable: false,
            })
        );
      }, 100);
    });
  };

  useEffect(() => {
    window.maps = [];
    window.initMap = initMap;

    if (!document.getElementById("gmapLoader")) {
      let script_tag = document.createElement("script");
      script_tag.id = "gmapLoader";
      script_tag.type = "text/javascript";
      script_tag.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyD-ytvHpafjsy_r9WbqGTj09_wkYuQAjSk&callback=initMap";
      document.body.appendChild(script_tag);
      return;
    }

    window.initMap();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <SC.Container>
      {mapsName.map((key, i) => (
        <SC.Card key={`${key}-${i}`} isCollapsed={isCollapsed[i]}>
          <SC.CardHeader>
            <SC.CardTitle>{key}</SC.CardTitle>
            <Cta text={isCollapsed[i] ? t("coverage.see_map") : t("coverage.hide_map")} action={() => changeCollapse(i)}></Cta>
          </SC.CardHeader>
          <SimpleMap />
        </SC.Card>
      ))}
    </SC.Container>
  );
}
