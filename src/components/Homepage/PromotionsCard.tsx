import React, { FC } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { BREAKPOINT } from "../../utils/constants";

const Card = styled.article`
  width: 269px;
  height: 303px;
  background: #fecd00;
  border-radius: 16px;
  margin: 0px 16px 0 0px;
  cursor: pointer;
  position: relative;

  box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.3);
  @media screen and (max-width: 1024px) {
    margin: 0px 16px;
  }

  @media screen and (max-width: ${BREAKPOINT}) {
    margin: 0px 16px;
    width: 190px;
    height: 290px;
  }
`;

const Chorizo = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  border-radius: 16px;

  img {
    border-top-left-radius: 16px;
  }

  @media screen and (max-width: ${BREAKPOINT}) {
    img:nth-child(2) {
      position: absolute;
      left: 0;
      top: 0;
    }
  }
`;

const Clip = styled.div`
  position: absolute;
  background: #f0c200;
  height: 180px;
  width: 100%;
  bottom: 0;
  left: 0;
  z-index: 1;

  clip-path: path(
    "M99.8061 345.582C229.433 114.928 653.103 177.767 479.24 82.4497C305.376 -12.8674 364.283 105.9 100.206 18.53C-163.871 -68.8401 -254.181 192.125 -185.723 252.594C-103.68 325.113 77.913 213.982 99.8061 345.582Z"
  );
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;

  @media screen and (max-width: ${BREAKPOINT}) {
    height: 100%;
    clip-path: path(
      "M94.2049 474.47C206.234 275.128 572.39 329.437 422.129 247.059C271.868 164.682 276.015 286.47 86.4037 191.8C-103.208 97.1294 -170.534 343.694 -152.563 394.106C-81.6576 456.78 75.2839 360.735 94.2049 474.47Z"
    );
  }
`;

const Cart = styled.div`
  position: absolute;
  bottom: 112px;
  left: 30px;
  z-index: 2;

  @media screen and (max-width: ${BREAKPOINT}) {
    left: 16px;
    bottom: 76px;
    img {
      width: 19.64px;
      height: 18px;
    }
  }
`;

const ProductosText = styled.h6`
  font-family: 'Montserrat', sans-serif;
  font-weight: 400;
  font-size: 26px;
  position: absolute;
  z-index: 2;
  left: 30px;
  bottom: 65px;
  @media screen and (max-width: ${BREAKPOINT}) {
    font-size: 14px;
    left: 16px;
    bottom: 42px;
  }
`;
const DestacadosText = styled.h5`
  font-family: 'Montserrat', sans-serif;
  font-weight: bold;
  font-size: 32px;
  position: absolute;
  z-index: 2;
  left: 30px;
  bottom: 30px;

  @media screen and (max-width: ${BREAKPOINT}) {
    font-size: 20px;
    left: 16px;
    bottom: 22px;
  }
`;

const PromotionsCard = () => {
  return (
    <Card>
      <Link to={"/productos/promociones"}>
        <Chorizo>
          {window.innerWidth <= 768 ? (
            <>
              <img src="/images/chori-mobile-promotions.webp" alt="Chorizo" width="190px" height="286px" className="lazyload" />
              <img src="/images/trigo-mobile-promotions.webp" alt="Trigo" width="107px" height="112px" className="lazyload" />
            </>
          ) : (
            <img src="/images/chori-desktop-promotions.webp" alt="Chorizo" width="249px" height="254px" className="lazyload" />
          )}
        </Chorizo>
        <Clip />
        <Cart>
          <img src="/images/carrito.webp" alt="carrito" width="31px" height="28px" className="lazyload" />
        </Cart>
        <ProductosText>Productos</ProductosText>
        <DestacadosText>Destacados</DestacadosText>
      </Link>
    </Card>
  );
};

export default PromotionsCard;
