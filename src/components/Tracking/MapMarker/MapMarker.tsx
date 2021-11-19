import React, { FC } from "react";
import { Marker, Wrapper } from "./style";

type Props = {
  lat: number;
  lng: number;
  icon: string;
  isPin?: boolean;
};
const MapMarker: FC<Props> = ({ icon, isPin }) => {
  return (
    <Wrapper>
      <Marker isPin={!!isPin}>
        <img
          className={"bounce"}
          src={icon}
          alt=""
        />
      </Marker>
    </Wrapper>
  );
};

export default MapMarker;
