import React, { FC } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BREAKPOINT } from "../../utils/constants";
import useProducts from "../../hooks/useProducts";

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../Loader"));
const ProductSlider = React.lazy(() => import(/* webpackChunkName: "ProductSlider" */ "./ProductSlider"));
const Cta = React.lazy(() => import(/* webpackChunkName: "Cta" */ "../Cta"));

const Container = styled.section`
  width: 100%;
  max-width: 1440px;
  margin: 0 auto 0;
  padding: 0;
  min-height: 421px;

  margin-bottom: 40px;
  @media screen and (max-width: ${BREAKPOINT}) {
    min-height: 408px;
    // padding: 0 0 0 15px;
    margin-bottom: 30px;
  }

  position: relative;
  .productslider-wrapper {
    overflow-x: hidden;
    > .main-container {
      background: var(--yellow);
      border-radius: 20px;

      > div {
        @media screen and (max-width: ${BREAKPOINT}) {
          padding-bottom: 20px;
        }
      }
    }
  }
  > img {
    position: absolute;
    top: -65px;
    width: 100%;
    z-index: -1;
    @media screen and (max-width: ${BREAKPOINT}) {
      display: none;
    }
  }
  @media screen and (max-width: ${BREAKPOINT}) {
    xbackground: no-repeat -400px center / 250%;
  }
  @media only screen and (-webkit-min-device-pixel-ratio: 1.3),
    only screen and (min--moz-device-pixel-ratio: 1.3),
    only screen and (-o-min-device-pixel-ratio: 2.6/2),
    only screen and (min-device-pixel-ratio: 1.3),
    only screen and (min-resolution: 124.8dpi),
    only screen and (min-resolution: 1.3dppx) {
    background: no-repeat top center / cover;
  }
`;

const CtaWrapper = styled.div`
  text-align: center;

  button {
    padding: 13px 80px;
    text-transform: uppercase;
  }
`;

type Props = {};

const Promotions: FC<Props> = () => {
  const { t } = useTranslation();
  const { products } = useProducts(9, true);

  return (
    <Container>
      <ProductSlider products={products} useArrows={window.innerHeight < 600} isPromotions={true} />
      <CtaWrapper>
        <Link to="/productos/promociones">
          <Cta action={() => {}} text={t("homepage.promotions.seeall")} filled={true} />
        </Link>
      </CtaWrapper>
    </Container>
  );
};

export default Promotions;
