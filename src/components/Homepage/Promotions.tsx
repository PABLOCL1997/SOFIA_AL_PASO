import React, { FC, Suspense, useState, useEffect } from "react";
import styled from "styled-components";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { Link, useHistory } from "react-router-dom";
import { GET_B2E_PRODUCTS, GET_PRODUCTS } from "../../graphql/products/queries";
import { useTranslation } from "react-i18next";
import { BREAKPOINT } from "../../utils/constants";

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

type Props = {
  userData: any;
};

const Promotions: FC<Props> = ({ userData }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [products, setProducts] = useState([]);
  const [idPriceList, setIdPriceList] = useState(0)

  const [loadProducts] = useLazyQuery(GET_PRODUCTS, {
    fetchPolicy:"network-only",
    onCompleted: d => setProducts(d.products.rows)
  });
  const [loadProductsFromListing] = useLazyQuery(GET_B2E_PRODUCTS, {
    fetchPolicy:"network-only",
    onCompleted: d => setProducts(d.productsB2B.rows)
  }) 

  useEffect(() => {
    if(userData?.userInfo?.length && userData?.userInfo[0] && userData.userInfo[0].idPriceList >= 0) {
      if (userData.userInfo[0].idPriceList !== idPriceList) {
        setIdPriceList(userData.userInfo[0].idPriceList)
      }
    }
  }, [userData])

  useEffect(() => {
    if (userData?.userInfo?.length && userData?.userInfo[0] && userData.userInfo[0].idPriceList > 0) {
      loadProductsFromListing({
        variables: {
          category_id: 0,
          limit: 9,
          offset: 0,
          city: userData.userInfo.length ? userData.userInfo[0].cityKey : "SC",
          id_price_list: String(userData.userInfo[0].idPriceList),
          onsale: true,
        }
      })
    } else {
      loadProducts({
        variables: {
          category_id: 0,
          limit: 20,
          offset: 0,
          onsale: true,
          city: userData.userInfo.length ? userData.userInfo[0].cityKey : "SC"
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idPriceList]);

  return (
      <Container>
        <div className="main-container">
          <Title>{t("homepage.promotions.title")}</Title>
          <div className="productslider-wrapper">
            <ProductSlider products={products} useArrows={true} />
          </div>
          <CtaWrapper>
            <Link to="/productos/promociones">
              <Cta
                action={() => {}}
                text={t("homepage.promotions.seeall")}
                filled={true}
              />
            </Link>
          </CtaWrapper>
        </div>
      </Container>
  );
};

export default Promotions;
