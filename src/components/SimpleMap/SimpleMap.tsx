import React from "react";
import * as SC from "./style"

export default function SimpleMap() {
  return (
    <SC.MapWrapper>
      <div className="gmap" />
    </SC.MapWrapper>
  );
}