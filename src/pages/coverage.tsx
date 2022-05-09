import React, { Suspense } from "react";
import styled from "styled-components";

import Loader from "../components/Loader";
import MapList from "../components/MapList";
import { BREAKPOINT } from "../utils/constants";
import Cochabamba from "../assets/coveragePolygons/cochabamba.json";
import SantaCruz from "../assets/coveragePolygons/santa_cruz.json";
import ElAlto from "../assets/coveragePolygons/el_alto.json";
import LaPaz from "../assets/coveragePolygons/la_paz.json";

const Header = styled.div`
  position: relative;
  padding: 54px 0;
  text-align: center;
  box-shadow: 0 -1px 52px rgba(0, 0, 0, 0.08);

  &:after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: -4px;
    margin-left: -40px;
    width: 80px;
    height: 8px;
    border-radius: 15px;
    background: var(--red);
  }

  @media screen and (max-width: ${BREAKPOINT}) {
    padding: 40px 20px;
  }
`;

const HeaderTitle = styled.h1`
  font-family: 'MontserratMedium';  font-size: 40px;
  line-height: 1.5em;
  color: var(--black);
`;

const Container = styled.div`
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 20px;
  display: block;
  flex-direction: column;
`;

const mapsLatLng = {
  Cochabamba: [-17.393814, -66.156981],
  "El Alto": [-16.515869, -68.155007],
  "La Paz": [-16.495653, -68.133518],
  "Santa Cruz": [-17.783326, -63.182132],
};

const mapsZoom = {
  Cochabamba: 12,
  "El Alto": 12,
  "La Paz": 13,
  "Santa Cruz": 11,
};

const mapsPolygons = {
    Cochabamba,
    "El Alto": ElAlto,
    "La Paz": LaPaz,
    "Santa Cruz": SantaCruz,
  };
  
  const mapsName = Object.keys(mapsLatLng);

export default function Coverage() {
  return (
    <Suspense fallback={<Loader />}>
      <Header>
        <Container>
          <HeaderTitle>Cobertura</HeaderTitle>
        </Container>
      </Header>
      <MapList {...{ mapsLatLng, mapsName, mapsPolygons, mapsZoom }} />
    </Suspense>
  );
}
