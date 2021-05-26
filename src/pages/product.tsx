import React, { Suspense, FC, useState, useEffect } from "react";
import styled from "styled-components";
import { useHistory, Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PRODUCT_TITLE } from "../meta";
import { fromLink, toLink } from "../utils/string";
import BreadCrumbs from "../components/Breadcrumbs/Breadcrumbs";

import { CategoryType } from "../graphql/categories/type";
import { BREAKPOINT, customStyles } from "../utils/constants";
import DelayedWrapper from "../components/DelayedWrapper";
import useProduct from "../hooks/useProduct";
import useCart from "../hooks/useCart";

const Loader = React.lazy(() =>
  import(/* webpackChunkName: "Loader" */ "../components/Loader")
);
const Slider = React.lazy(() =>
  import(/* webpackChunkName: "Slider" */ "react-slick")
);
const RelatedProducts = React.lazy(() =>
  import(
    /* webpackChunkName: "RelatedProducts" */ "../components/Product/RelatedProducts"
  )
);
const Chevron = React.lazy(() =>
  import(/* webpackChunkName: "Chevron" */ "../components/Images/Chevron")
);
const Cta = React.lazy(() =>
  import(/* webpackChunkName: "Cta" */ "../components/Cta")
);
const FreeDelivery = React.lazy(() =>
  import(
    /* webpackChunkName: "FreeDelivery" */ "../components/Images/FreeDelivery"
  )
);
const Quality = React.lazy(() =>
  import(/* webpackChunkName: "Quality" */ "../components/Images/Quality")
);
const ContinueArrow = React.lazy(() =>
  import(
    /* webpackChunkName: "ContinueArrow" */ "../components/Images/ContinueArrow"
  )
);
const Close = React.lazy(() =>
  import(/* webpackChunkName: "Close" */ "../components/Images/Close")
);

const Header = styled.div`
  padding: var(--padding);
  display: flex;
  justify-content: space-between;
  @media screen and (max-width: ${BREAKPOINT}) {
    margin-top: 80px;
    padding: 20px;
    justify-content:  space-between;
  }
`;

const HeaderLink = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  @media screen and (max-width: ${BREAKPOINT}) {
    flex-direction: row-reverse;
  }
  span {
    font-size: 16px;
    line-height: 16px;
    color: var(--red);
    margin-right: 10px;
    cursor: pointer;
  }
  svg {
    cursor: pointer;
    @media screen and (max-width: ${BREAKPOINT}) {
      transform: rotate(180deg);
      margin-right: 10px;
    }
  }
`;

const Wrapper = styled.div`
  padding: var(--padding);
  display: flex;
  @media screen and (max-width: ${BREAKPOINT}) {
    flex-direction: column;
    padding: 20px;
  }

  .slick-slide img {
    margin: 0 auto;
    width: 100%;
    height: 354px;
    object-fit: contain;

    @media (max-width: ${BREAKPOINT}) {
      object-fit: contain;
      width: 100%;
      height: 250px;
    }
  }
`;

const Col1 = styled.div`
  width: calc(50% - 8px);
  margin-right: 16px;
  .slick-dots {
    bottom: -25px;
    li {
      background: var(--btn-background);
      box-shadow: 0 0 0 1px var(--black);
      border-radius: 20px;
      width: 12px;
      height: 12px;
      opacity: 0.35;
      * {
        opacity: 0;
      }
    }
    .slick-active {
      box-shadow: 0 0 0 1px var(--btn-background);
      opacity: 1;
    }
  }
  @media screen and (max-width: ${BREAKPOINT}) {
    width: 100%;
    margin-right: 0;
    margin-bottom: 16px;
  }
`;

const Col2 = styled.div`
  flex: 1;
`;

const Image = styled.div<{ src: string; srcSet?: string }>`
  height: 354px;
  background: url(${props => props.src}) no-repeat center center / contain;

  @media screen and (max-width: ${BREAKPOINT}) {
    height: 250px;
  }
`;

const ProductTitle = styled.h2`
  font-family: MullerBold;
  font-size: 30px;
  line-height: 30px;
  color: var(--black);
  margin-bottom: 16px;
  @media screen and (max-width: ${BREAKPOINT}) {
    font-size: 20px;
    line-height: 20px;
    margin-top: 30px;
  }
`;

const ProductText = styled.ul`
  li {
    font-size: 14px;
    line-height: 14px;
    color: black;
    margin-bottom: 14px;
    &:before {
      content: "\\2022";
      color: var(--red);
      font-weight: bold;
      font-size: 30px;
      display: inline-block;
      vertical-align: middle;
      margin-right: 10px;
    }
  }
`;
ProductText.displayName = "ProductText";

const Categories = styled.div`
  margin: 25px 0;
  display: flex;
  align-items: center;
  @media screen and (max-width: ${BREAKPOINT}) {
    margin: 32px 0;
  }
  span {
    font-family: MullerMedium;
    font-size: 10px;
    line-height: 10px;
    color: var(--black);
    margin-right: 5px;
  }
  a {
    font-family: MullerMedium;
    font-size: 10px;
    line-height: 10px;
    text-decoration-line: underline;
    color: var(--red);
    &:hover {
      opacity: 0.8;
    }
  }
`;

const Toolbox = styled.div`
  display: flex;
  margin: 24px 0 50px;
  button {
    padding: 11px 80px;
    margin-left: 20px;
  }

  @media screen and (max-width: ${BREAKPOINT}) {
    position: fixed;
    bottom: 0;
    background: white;
    width: 100%;
    left: 0;
    padding: 30px;
    margin: 0;
    z-index: 3;
    button {
      font-size: 14px;
      text-transform: uppercase;
      padding: 15px 70px;
      margin: 0 15px;
      span {
        font-family: MullerExtraBold;
      }
    }
  }
`;

const Qty = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid var(--yellow);
  border-radius: 20px;
  padding: 15px;
  select {
    cursor: pointer;
    -webkit-appearance: none;
    background: none;
    border: 0;
    width: 40px;
    padding-left: 10px;
    font-size: 12px;
    line-height: 12px;
    font-family: MullerRegular;
    @media screen and (max-width: ${BREAKPOINT}) {
      color: var(--black);
    }
  }
  svg {
    pointer-events: none;
    position: absolute;
    right: 15px;
  }
`;

const DeliveryBox = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 25px;
`;

const Text = styled.div`
  font-size: 12px;
  line-height: 12px;
  color: var(--font);
  margin-top: 5px;
`;

const Title = styled.div`
  margin-left: 10px;
  span {
    font-family: MullerBold;
    font-size: 12px;
    line-height: 12px;
    color: var(--black);
  }
`;

const Disclaimer = styled.div`
  font-family: MullerMedium;
  font-size: 14px;
  line-height: 18px;
  color: var(--black);
  @media screen and (max-width: ${BREAKPOINT}) {
    margin-bottom: 30px;
  }
`;

const PriceBox = styled.div`
  text-align: left;
  margin: 0px 0 10px;
  padding: 0 10px;
  display: flex;
  align-items: flex-start;
  @media screen and (max-width: ${BREAKPOINT}) {
    margin: 0;
    padding: 0;
  }
}
`;

const Price = styled.div`
  font-size: 24px;
  line-height: 24px;
  color: var(--red);
  margin-bottom: 58px;
  font-family: MullerBold;
  margin: 0px 0px 15px;
  @media screen and (max-width: ${BREAKPOINT}) {
    margin-bottom: 30px;
    font-size: 20px;
    line-height: 20px;
  }
`;

const EstimatedPrice = styled.div<{ visible?: boolean }>`
  font-family: MullerMedium;
  font-size: 14px;
  line-height: 14px;
  text-align: left;
  color: var(--font);
  padding: 5px 10px;
  display: ${props => (props.visible ? "block" : "none")};
  @media screen and (max-width: ${BREAKPOINT}) {
    padding: 5px 0;
  }
`;

const Label = styled.div<{ visible?: boolean }>`
  font-family: MullerMedium;
  font-size: 24px;
  line-height: 24px;
  text-align: left;
  color: var(--font);
  padding: 0 10px 5px 0;
  display: ${props => (props.visible ? "block" : "none")};
  @media screen and (max-width: ${BREAKPOINT}) {
    font-size: 20px;
    line-height: 20px;
  }
`;

const DiscountPrice = styled.span`
  color: var(--red);
  font-size: 14px;
  margin-left: 5px;
  text-decoration: line-through;
`;

const CloseWrapper = styled.div`
  cursor: pointer;
  flex: 1;
  svg {
    margin-top: 0;
    margin-left: 5px;
    path {
      stroke: var(--red);
    }
  }
  &:hover {
    opacity: 0.8;
  }
`;

const OutOfStock = styled.span`
  font-family: MullerBold;
  color: var(--red);
  border: 1px solid var(--red);
  padding: 10px 100px;
  border-radius: 30px;
  align-items: center;
  text-aling: center;
  margin: 0 auto;
  font-family: MullerMedium;
  font-size: 16px;
  line-height: 16px;
`;

const BreadWrap = styled.div`
  margin: 15px 0;  
  padding: 0;
  ul {
    li {
      a {
        color: ${customStyles.darkGrey};
        font-size: 12px;
        line-height: 16px;
      }
    }
  }

  @media screen and (max-width: ${BREAKPOINT}) {
    margin: 0;
  }
`;

type Props = {
  inlineProdname?: String;
  oldUrl?: String;
  closeModal?: Function;
  openModal?: Function;
};

const Product: FC<Props> = ({
  inlineProdname = "",
  oldUrl,
  closeModal,
  openModal
}) => {
  let { prodname } = useParams();
  prodname = fromLink(prodname || String(inlineProdname));
  const settings = {
    dots: true,
    infinite: false,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };
  const { t } = useTranslation();
  const history = useHistory();
  const { product, categories, related, detail: dataProdDetail, loadingDetail: loadingProdDetail, toCatLink } = useProduct()
  const { addAndGo } = useCart()
  const [qty, setQty] = useState<number>(1);

  const proceed = () => {
    if (oldUrl) {
      history.push(String(oldUrl));
      if (closeModal) closeModal();
    } else {
      history.push("/productos");
    }
  };

  useEffect(() => {
    document.title = `${PRODUCT_TITLE} ${prodname}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Suspense fallback={<Loader />}>
      <DelayedWrapper noHeader={true}>
        <div className="main-container">
          <Header>
            {oldUrl && (
              <CloseWrapper onClick={proceed}>
                <Close />
              </CloseWrapper>
            )}
            <BreadWrap>
              <BreadCrumbs
                isMobile={
                  window.innerWidth < parseInt(BREAKPOINT.replace("px", ""))
                }
                additionalLinks={[
                  {
                    routeLink: "/",
                    routeName: "Home "
                  },
                  {
                    routeLink: "/productos",
                    routeName: "/ Tienda"
                  },
                  ...categories
                  .sort((a:CategoryType, b:CategoryType) => a.level - b.level)
                  .map(cat => {
                    return {
                      routeLink: `/productos/${toCatLink(cat.name, cat.level)}`,
                      routeName: ` / ${cat.name}`
                    }
                  }),
                  {
                    routeLink: `/${toLink(prodname)}`,
                    routeName: ` / ${prodname}`
                  }
                ]}
              />
            </BreadWrap>
            <HeaderLink onClick={proceed}>
              <span>{t("product.continue_shopping")}</span>
              <ContinueArrow />
            </HeaderLink>
          </Header>
          {product && product.entity_id && (
            <Wrapper>
              <Col1>
                <Slider {...settings}>
                  {product.image
                    .split(",")
                    .map((img: string, index: number) => (
                      <div
                        key={index + " Index"}
                        style={{ textAlign: "center" }}
                      >
                        {/*          <Image src={img}></Image>  */}

                        {/*       {
                          <img
                          width="100px"
                          height="100px"
                     
                            srcSet={
                              img +
                              " 1x  ," +
                              img.slice(0, -4)+"_708px.webp" +
                              " 2x  ," +
                              img.slice(0, -4) +
                              "_708px.webp" +
                              " 3x"
                            }
                            src={img}
                          />
                        } */}

                        <picture>
                          {/* <source
                            srcSet={img}
                            type="image"
                          /> */}
                          {/* <source srcSet={img + " 1x"} type="image/jpeg" /> */}
                          <img src={img} alt={product.name} />
                        </picture>
                      </div>
                    ))}
                </Slider>
              </Col1>
              <Col2>
                <ProductTitle>
                  {product.useKGS
                    ? `${product.name} DE ${Number(product.weight)
                        .toFixed(2)
                        .replace(".", ",")} KGS APROX.`
                    : product.name}
                </ProductTitle>
                <EstimatedPrice visible={product.useKGS}>
                  Bs.{" "}
                  {(product.special_price / product.weight)
                    .toFixed(2)
                    .replace(".", ",")}
                  / KGS
                </EstimatedPrice>
                <PriceBox>
                  <Label visible={product.useKGS}>
                    {t("itembox.price_label")}:
                  </Label>
                  <Price>
                    Bs. {product.special_price.toFixed(2).replace(".", ",")}
                  </Price>
                  {product.special_price < product.price && (
                    <DiscountPrice>
                      Bs. {product.price.toFixed(2).replace(".", ",")}
                    </DiscountPrice>
                  )}
                </PriceBox>
                {product.stock > 0 ? (
                  <Toolbox>
                    <Qty>
                      <select
                        onChange={event => setQty(Number(event.target.value))}
                      >
                        {[...(Array(21).keys() as any)]
                          .slice(1)
                          .map((opt: any, index: number) => (
                            <option key={index} value={opt}>
                              {opt}
                            </option>
                          ))}
                      </select>
                      <Chevron />
                    </Qty>
                    <Cta
                      filled={true}
                      text={t("product.add")}
                      action={() => addAndGo(product, qty)}
                    />
                  </Toolbox>
                ) : (
                  <Toolbox>
                    <OutOfStock>Temporalmente sin stock</OutOfStock>
                  </Toolbox>
                )}
                <ProductText>
                  {!loadingProdDetail &&
                    dataProdDetail &&
                    dataProdDetail.productDetail
                      .split("\n")
                      .filter((line: string) => line.trim())
                      .map((line: string, index: number) => (
                        <li
                          key={index}
                          dangerouslySetInnerHTML={{ __html: line.trim() }}
                        />
                      ))}
                </ProductText>
                <Categories>
                  <span>{t("product.categories")}: </span>
                  {categories.map((cat: CategoryType, index: number) => (
                    <span key={cat.name}>
                      <Link
                        key={index}
                        to={`/productos/${toCatLink(cat.name, cat.level)}`}
                      >
                        {cat.name}
                      </Link>
                      {index === categories.length - 1 ? "" : ", "}
                    </span>
                  ))}
                </Categories>
                <DeliveryBox>
                  <FreeDelivery />
                  <Title>
                    <span>{t("product.delivery.title")}</span>
                    <Text>{t("product.delivery.text")}</Text>
                  </Title>
                </DeliveryBox>
                <DeliveryBox>
                  <Quality />
                  <Title>
                    <span>{t("product.warranty.title")}</span>
                    <Text>{t("product.warranty.text")}</Text>
                  </Title>
                </DeliveryBox>
                <Disclaimer>{/*t('product.disclaimer')*/}</Disclaimer>
              </Col2>
            </Wrapper>
          )}
          {!!related.length && (
            <RelatedProducts openModal={openModal} products={related} />
          )}
        </div>
      </DelayedWrapper>
    </Suspense>
  );
};

export default Product;
