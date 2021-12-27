import React, { Suspense, FC, useState, useEffect } from "react";
import { useHistory, Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { PRODUCT_TITLE } from "../meta";
import { fromLink, toCatLink, toLink } from "../utils/string";
import BreadCrumbs from "../components/Breadcrumbs/Breadcrumbs";
import { CategoryType } from "../graphql/categories/type";
import { BREAKPOINT } from "../utils/constants";

import * as SC from "../styled-components/pages/product";
import useProduct from "../hooks/useProduct";
import useCart from "../hooks/useCart";
import useCityPriceList from "../hooks/useCityPriceList";

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../components/Loader"));
const Slider = React.lazy(() => import(/* webpackChunkName: "Slider" */ "react-slick"));
const RelatedProducts = React.lazy(() => import(/* webpackChunkName: "RelatedProducts" */ "../components/Product/RelatedProducts"));
const Chevron = React.lazy(() => import(/* webpackChunkName: "Chevron" */ "../components/Images/Chevron"));
const Cta = React.lazy(() => import(/* webpackChunkName: "Cta" */ "../components/Cta"));
const FreeDelivery = React.lazy(() => import(/* webpackChunkName: "FreeDelivery" */ "../components/Images/FreeDelivery"));
const Quality = React.lazy(() => import(/* webpackChunkName: "Quality" */ "../components/Images/Quality"));
const ContinueArrow = React.lazy(() => import(/* webpackChunkName: "ContinueArrow" */ "../components/Images/ContinueArrow"));
const Close = React.lazy(() => import(/* webpackChunkName: "Close" */ "../components/Images/Close"));

type Props = {
  inlineProdname?: String;
  oldUrl?: String;
  closeModal?: Function;
  openModal?: Function;
};

const LoaderWrapper = styled.div`
  background: white;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  border-radius: 20px;
  img {
    width: 50px;
  }
`;

const Product: FC<Props> = ({ inlineProdname = "", oldUrl, closeModal, openModal }) => {
  let { prodname } = useParams();
  prodname = fromLink(prodname || String(inlineProdname));
  const settings = {
    dots: true,
    infinite: false,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const { t } = useTranslation();
  const history = useHistory();
  const { product, categories, related, detail: dataProdDetail, loadingDetail: loadingProdDetail, error } = useProduct("", true);
  const { agency } = useCityPriceList();
  const { addAndGo } = useCart();
  const [qty, setQty] = useState<number>(1);

  const proceed = () => {
    if (oldUrl) {
      history.push(String(oldUrl));
      if (closeModal) closeModal();
    } else {
      history.push("/productos");
    }
  };

  if (error) {
    history.replace("/404");
  }

  useEffect(() => {
    document.title = `${PRODUCT_TITLE} ${prodname}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Suspense
      fallback={
        <LoaderWrapper>
          <img src="/images/loader.svg" width="50px" height="50px" alt="loader" />
        </LoaderWrapper>
      }
    >
      <SC.MainContainer>
        <SC.Header>
          {oldUrl && (
            <SC.CloseWrapper onClick={proceed}>
              <Close />
            </SC.CloseWrapper>
          )}
          <SC.BreadWrap>
            <BreadCrumbs
              isMobile={window.innerWidth < parseInt(BREAKPOINT.replace("px", ""))}
              additionalLinks={[
                {
                  routeLink: "/",
                  routeName: "Home ",
                },
                {
                  routeLink: "/productos",
                  routeName: "/ Tienda",
                },
                ...categories
                  .sort((a: CategoryType, b: CategoryType) => a.level - b.level)
                  .map((cat) => {
                    return {
                      routeLink: `/productos/${toCatLink(categories, cat.name, cat.level)}`,
                      routeName: ` / ${cat.name}`,
                    };
                  }),
                {
                  routeLink: `/${toLink(prodname)}`,
                  routeName: ` / ${prodname}`,
                },
              ]}
            />
          </SC.BreadWrap>
          <SC.HeaderLink onClick={proceed}>
            <span>{t("product.continue_shopping")}</span>
            <ContinueArrow />
          </SC.HeaderLink>
        </SC.Header>
        {product && product.entity_id ? (
          <SC.Wrapper>
            <SC.Col1>
              <Slider {...settings}>
                {product.image.split(",").map((img: string, index: number) => (
                  <div key={index + " Index"} style={{ textAlign: "center" }}>
                    <picture>
                      <img src={img} alt={product.name} />
                    </picture>
                  </div>
                ))}
              </Slider>
            </SC.Col1>
            <SC.Col2>
              <SC.ProductTitle>{product.useKGS ? `${product.name} DE ${Number(product.weight).toFixed(2).replace(".", ",")} KGS APROX.` : product.name}</SC.ProductTitle>
              <SC.EstimatedPrice visible={product.useKGS}>Bs. {(product.special_price / product.weight).toFixed(2).replace(".", ",")}/ KGS</SC.EstimatedPrice>
              <SC.PriceBox>
                <SC.Label visible={product.useKGS}>{t("itembox.price_label")}:</SC.Label>
                <SC.Price>Bs. {product.special_price.toFixed(2).replace(".", ",")}</SC.Price>
                {product.special_price < product.price && <SC.DiscountPrice>Bs. {product.price.toFixed(2).replace(".", ",")}</SC.DiscountPrice>}
              </SC.PriceBox>
              {product.stock > 0 ? (
                <SC.Toolbox>
                  <SC.Qty>
                    <select onChange={(event) => setQty(Number(event.target.value))}>
                      {[...(Array(21).keys() as any)].slice(1).map((opt: any, index: number) => (
                        <option key={index} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <Chevron />
                  </SC.Qty>
                  <Cta filled={true} text={t("product.add")} action={() => addAndGo(product, qty)} />
                </SC.Toolbox>
              ) : (
                <SC.Toolbox>
                  <SC.OutOfStock>Temporalmente sin stock</SC.OutOfStock>
                </SC.Toolbox>
              )}
              <SC.ProductText>
                {!loadingProdDetail &&
                  dataProdDetail &&
                  dataProdDetail.productDetail
                    .split("\n")
                    .filter((line: string) => line.trim())
                    .map((line: string, index: number) => <li key={index} dangerouslySetInnerHTML={{ __html: line.trim() }} />)}
              </SC.ProductText>
              <SC.Categories>
                <span>{t("product.categories")}: </span>
                {categories.map((cat: CategoryType, index: number) => (
                  <span key={cat.name}>
                    <Link key={index} to={`/productos/${toCatLink(categories, cat.name, cat.level)}`}>
                      {cat.name}
                    </Link>
                    {index === categories.length - 1 ? "" : ", "}
                  </span>
                ))}
              </SC.Categories>
              {agency ? (
                // when agency show the pickup message
                <SC.DeliveryBox>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="20" fill="#E30613" />
                    <path
                      d="M 20.0492 10.9912 C 16.1218 10.9912 13 14.0865 13 17.9805 C 13 19.8776 13.7049 21.6748 15.1148 22.9728 C 15.2155 23.0727 19.2435 26.6671 19.3442 26.767 C 19.7471 27.0665 20.3513 27.0665 20.6534 26.767 C 20.7541 26.6671 24.8829 23.0727 24.8829 22.9728 C 26.2927 21.6748 26.9976 19.8776 26.9976 17.9805 C 27.0983 14.0865 23.9766 10.9912 20.0492 10.9912 Z M 20.0492 19.9774 C 18.9414 19.9774 18.0351 19.0788 18.0351 17.9805 C 18.0351 16.8822 18.9414 15.9836 20.0492 15.9836 C 21.1569 15.9836 22.0632 16.8822 22.0632 17.9805 C 22.0632 19.0788 21.1569 19.9774 20.0492 19.9774 Z"
                      fill="white"
                    />
                  </svg>
                  <SC.Title>
                    <span>{t("product.pickup.title")}</span>
                    <SC.Text>{t("product.pickup.text")}</SC.Text>
                  </SC.Title>
                </SC.DeliveryBox>
              ) : (
                // when no agency show the delivery message
                <SC.DeliveryBox>
                  <FreeDelivery />
                  <SC.Title>
                    <span>{t("product.delivery.title")}</span>
                    <SC.Text>{t("product.delivery.text")}</SC.Text>
                  </SC.Title>
                </SC.DeliveryBox>
              )}
              <SC.DeliveryBox>
                <Quality />
                <SC.Title>
                  <span>{t("product.warranty.title")}</span>
                  <SC.Text>{t("product.warranty.text")}</SC.Text>
                </SC.Title>
              </SC.DeliveryBox>
              <SC.Disclaimer>{/*t('product.disclaimer')*/}</SC.Disclaimer>
            </SC.Col2>
          </SC.Wrapper>
        ) : (
          <LoaderWrapper>
            <img src="/images/loader.svg" width="50px" height="50px" alt="loader" />
          </LoaderWrapper>
        )}
        {!!related.length && <RelatedProducts openModal={openModal} products={related} />}
      </SC.MainContainer>
    </Suspense>
  );
};

export default Product;
