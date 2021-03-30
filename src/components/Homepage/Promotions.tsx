import React, { FC, Suspense, useState, useEffect } from "react";
import styled from "styled-components";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { useHistory } from "react-router-dom";
import { GET_PRODUCTS } from "../../graphql/products/queries";
import { useTranslation } from "react-i18next";
import { BREAKPOINT } from "../../utils/constants";
import { GET_USER } from "../../graphql/user/queries";

const Loader = React.lazy(() =>
  import(/* webpackChunkName: "Loader" */ "../Loader")
);
const ProductSlider = React.lazy(() =>
  import(/* webpackChunkName: "ProductSlider" */ "./ProductSlider")
);
const Cta = React.lazy(() => import(/* webpackChunkName: "Cta" */ "../Cta"));

const Container = styled.div`
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
    xbackground: url(/images/promotions_bg.png) no-repeat -400px center / 250%;
  }
  @media only screen and (-webkit-min-device-pixel-ratio: 1.3),
    only screen and (min--moz-device-pixel-ratio: 1.3),
    only screen and (-o-min-device-pixel-ratio: 2.6/2),
    only screen and (min-device-pixel-ratio: 1.3),
    only screen and (min-resolution: 124.8dpi),
    only screen and (min-resolution: 1.3dppx) {
    background: url(/images/promotions_bg.webp) no-repeat top center / cover;
  }
`;

const Title = styled.h2`
  font-family: MullerMedium;
  font-size: 40px;
  line-height: 40px;
  color: var(--black);
  text-align: center;
  margin-bottom: 75px;
  @media screen and (max-width: ${BREAKPOINT}) {
    margin-bottom: 30px;
  }
`;

const CtaWrapper = styled.div`
  text-align: center;
  margin-top: 30px;
  button {
    padding: 13px 80px;
    text-transform: uppercase;
  }
`;

type Props = {};

const Promotions: FC<Props> = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [products, setProducts] = useState([]);
  const { data: userData } = useQuery(GET_USER, {});
  const [loadProducts] = useLazyQuery(GET_PRODUCTS, {
    variables: {
      category_id: 0,
      limit: 20,
      offset: 0,
      onsale: true,
      city: userData.userInfo.length ? userData.userInfo[0].cityKey : ""
    },
    fetchPolicy: "cache-and-network",
    onCompleted: d => setProducts(d.products.rows)
  });

  const seeAll = () => {
    history.push(`/productos/promociones`);
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
      <Container>
        <div className="main-container">
          <Title>{t("homepage.promotions.title")}</Title>
          <div className="productslider-wrapper">
            <ProductSlider products={products} useArrows={true} />
          </div>
          <CtaWrapper>
            <Cta
              action={seeAll}
              text={t("homepage.promotions.seeall")}
              filled={true}
            />
          </CtaWrapper>
        </div>
      </Container>
  );
};

export default Promotions;
