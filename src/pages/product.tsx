import React, { Suspense, FC, useState, useEffect } from "react";
import styled from "styled-components";
import { useHistory, Link, useParams } from "react-router-dom";
import { useMutation, useLazyQuery, useQuery } from "@apollo/react-hooks";
import { useTranslation } from "react-i18next";
import { GET_PRODUCT } from "../graphql/products/queries";
import { ADD_ITEM } from "../graphql/cart/mutations";
import { PRODUCT_TITLE } from "../meta";
import { trackProduct, trackAddToCart } from "../utils/dataLayer";
import { fromLink, toLink } from "../utils/string";
import { ProductType } from "../graphql/products/type";
import { CategoryType } from "../graphql/categories/type";
import { BREAKPOINT } from "../utils/constants";
import { GET_USER } from "../graphql/user/queries";
import DelayedWrapper from "../components/DelayedWrapper";
import { SET_USER } from "../graphql/user/mutations";

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
  justify-content: flex-end;
  @media screen and (max-width: ${BREAKPOINT}) {
    padding: 20px;
    justify-content: flex-start;
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
`;

const Col1 = styled.div`
  width: calc(50% - 8px);
  margin-right: 16px;
  .slick-dots {
    bottom: -5px;
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

const Image = styled.div<{ src: string }>`
  height: 354px;
  background: url(${props => props.src}) no-repeat center center / contain;

  @media screen and (max-width: ${BREAKPOINT}) {
    height: 250px;
  }
`;

const ProductTitle = styled.h1`
  font-family: MullerBold;
  font-size: 30px;
  line-height: 30px;
  color: var(--black);
  margin-bottom: 16px;
  @media screen and (max-width: ${BREAKPOINT}) {
    font-size: 20px;
    line-height: 20px;
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
      padding: 15px 80px;
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
  const [product, setProduct] = useState<ProductType | any>({});
  const [categories, setCategories] = useState<Array<CategoryType>>([]);
  const [related, setRelated] = useState<Array<ProductType>>([]);
  const [qty, setQty] = useState<number>(1);
  const { data: userData } = useQuery(GET_USER, {});
  const [loadProduct] = useLazyQuery(GET_PRODUCT, {
    variables: {
      name: prodname,
      city: userData.userInfo.length ? userData.userInfo[0].cityKey : "",
      categories: true,
      related: true
    },
    fetchPolicy: "cache-and-network",
    onCompleted: d => {
      setProduct(d.product);
      trackProduct(d.product);
      if (d.product.categories) setCategories(d.product.categories);
      if (d.product.related) setRelated(d.product.related);
    }
  });
  const [toggleLoginModal] = useMutation(SET_USER, {
    variables: { user: { openLoginModal: true } }
  });
  const [addItem] = useMutation(ADD_ITEM, {
    variables: {
      product: { ...product, categories: [], description: false, qty }
    }
  });
  const [showSuccess] = useMutation(SET_USER, {
    variables: {
      user: { showModal: t("cart.add_msg", { product: product.name }) }
    }
  });

  const addAndGo = () => {
    if (userData.userInfo.length && userData.userInfo[0].isLoggedIn) {
      trackAddToCart({ ...product, categories: [], description: false, qty });
      addItem();
      showSuccess();
    } else {
      if (closeModal) closeModal();
      toggleLoginModal();
    }
  };

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
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const discount = (1 - product.special_price / product.price) * 100;

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
                      <div key={index}>
                        <Image src={img}></Image>
                      </div>
                    ))}
                </Slider>
              </Col1>
              <Col2>
                <ProductTitle>{product.name}</ProductTitle>
                <EstimatedPrice visible={product.unit === "KGS"}>
                  Bs.{" "}
                  {(product.special_price * product.weight)
                    .toFixed(2)
                    .replace(".", ",")}
                  /{product.unit}
                </EstimatedPrice>
                <PriceBox>
                  <Label visible={product.unit === "KGS"}>
                    {t("itembox.price_label")}:
                  </Label>
                  <Price>
                    Bs. {product.special_price.toFixed(2).replace(".", ",")}
                  </Price>
                  {discount > 0 && (
                    <DiscountPrice>
                      Bs. {product.price.toFixed(2).replace(".", ",")}
                    </DiscountPrice>
                  )}
                </PriceBox>
                <ProductText>
                  {product.description
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
                    <span>
                      <Link key={index} to={`/productos/${toLink(cat.name)}`}>
                        {cat.name}
                      </Link>
                      {index === categories.length - 1 ? "" : ", "}
                    </span>
                  ))}
                </Categories>
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
                    action={addAndGo}
                  />
                </Toolbox>
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
