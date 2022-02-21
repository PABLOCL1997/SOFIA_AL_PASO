import React, { FC, Suspense, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { BREAKPOINT } from "../utils/constants";
import { enableGmap, setLatLng } from "../utils/googlemaps";

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */ "./Loader"));
const Crosshair = React.lazy(() => import(/* webpackChunkName: "Crosshair" */ "./Images/Crosshair"));

const MapContainer = styled.div`
  margin-top: 40px;
  h2 {
    font-family: MullerMedium;
    font-size: 14px;
    line-height: 14px;
    letter-spacing: 0.01em;
    color: var(--black);
    margin-bottom: 20px;
  }
`;

const MapWrapper = styled.div`
  position: relative;
  #gmap {
    width: 100%;
    height: 300px;
    background: var(--whiter);
    border-radius: 20px;
  }
  @media screen and (max-width: ${BREAKPOINT}) {
    margin-top: 45px;
  }
`;

const Pin = styled.div`
  position: absolute;
  font-family: MullerMedium;
  font-size: 12px;
  line-height: 12px;
  color: var(--black);
  background: white;
  border-radius: 20px;
  padding: 15px 40px;
  right: 20px;
  top: -20px;
  box-shadow: 0px 5px 36px rgba(0, 0, 0, 0.18);
  z-index: 2;
  @media screen and (max-width: ${BREAKPOINT}) {
    right: auto;
    padding: 12px 20px;
    left: 50%;
    margin-left: -123px;
  }
`;

const Geo = styled.div`
  background: white;
  position: absolute;
  box-shadow: 0px 5px 36px rgba(0, 0, 0, 0.18);
  border-radius: 35px;
  display: flex;
  align-items: center;
  padding: 10px 15px;
  top: 20px;
  left: 20px;
  cursor: pointer;
  z-index: 2;
  span {
    flex: 1;
    font-family: MullerMedium;
    font-size: 12px;
    line-height: 12px;
    color: var(--black);
    margin-left: 10px;
  }
  @media screen and (max-width: ${BREAKPOINT}) {
    bottom: -15px;
    top: auto;
    left: 50%;
    margin-left: -91px;
  }
`;

type Props = {};

const Map: FC<Props> = () => {
  const { t } = useTranslation();

  const geoLocate = () => {
    if (navigator.geolocation) {
      try {        
        navigator.geolocation.getCurrentPosition(
          function (position) {
            setLatLng("", position.coords.latitude, position.coords.longitude);
            if ((window as any).updateMapUsed) (window as any).updateMapUsed();
          },
          function (errors) {
            console.log(errors);
          },
          {
            timeout: 5000,
          }
        );
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    enableGmap();
  }, []);

  return (
    <Suspense fallback={<Loader />}>
      <MapContainer>
        <h2>{t("checkout.delivery.map.title")}</h2>
        <MapWrapper>
          <Pin>{t("checkout.delivery.map.pin")}</Pin>
          <Geo onClick={geoLocate}>
            <Crosshair />
            <span>{t("checkout.delivery.map.geo")}</span>
          </Geo>
          <div id="gmap"></div>
        </MapWrapper>
      </MapContainer>
    </Suspense>
  );
};

export default Map;


export const Wrapper = styled.div`
  position: relative;
`;

export const Circle = styled.div<{ radius: number }>`
  position: relative;
  border: 1px solid #e30613;
  width: ${(props) => props.radius / 5 + "px"};
  height: ${(props) => props.radius / 5 + "px"};
  border-radius: 50%;
  top: -13px;
  left: -13px;
  background-color: rgba(227, 6, 19, 0.5);
`;


export const MapCircle: FC<{ radius: number }> = ({ radius }) => {
  return (
    <Wrapper>
      {/* <Name maxWidth={maxWidth} title={text}>{name}</Name> */}
      <Circle radius={radius} />
    </Wrapper>
  );
};

