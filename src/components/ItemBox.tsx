import React, { FC, Suspense, useState } from "react";
import styled from "styled-components";
import { ProductType } from "../graphql/products/type";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { toLink } from "../utils/string";
import { ADD_ITEM } from "../graphql/cart/mutations";
import { trackAddToCart } from "../utils/dataLayer";
import { BREAKPOINT } from "../utils/constants";
import { GET_USER } from "../graphql/user/queries";
import { SET_USER } from "../graphql/user/mutations";
import { GET_CART_ITEMS } from "../graphql/cart/queries";

const Loader = React.lazy(
  () => import(/* webpackChunkName: "Loader" */ "./Loader")
);
const Chevron = React.lazy(
  () => import(/* webpackChunkName: "Chevron" */ "./Images/Chevron")
);

const Container = styled.div`
  position: relative;
  background: #ffffff;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.06);
  border-radius: 20px;
  margin: 40px 10px;
  padding: 14px 10px 22px;
`;

const Discount = styled.div`
  position: absolute;
  top: -20px;
  right: 8px;
  background: var(--red);
  box-shadow: 0px 8px 29px rgba(254, 205, 0, 0.4);
  border-radius: 3px;
  font-family: MullerBold;
  font-size: 14px;
  line-height: 14px;
  display: flex;
  align-items: flex-end;
  text-align: left;
  color: var(--black);
  padding: 3px 4px 1px;
  div {
    display: flex;
    flex-direction: column;
    color: white;
    &:first-child {
      font-size: 28px;
      font-weight: bold;
      margin-right: 2px;
      padding-bottom: 5px;
    }
    &:last-child {
      padding-top: 5px;
    }
    span {
      font-size: 8px;
      font-weight: bold;
      &:first-child {
        line-height: 5px;
        font-size: 12px;
      }
    }
  }
`;

const Link = styled.div`
  cursor: pointer;
  position: relative;
`;

const NewLabel = styled.span`
  position: absolute;
  left: 0;
  top: 25px;
  width: 75px;
  background: var(--red);
  color: white;
  font-weight: bold;
  text-align: center;
  padding: 5px 0px 3px;
  text-transform: uppercase;
  border-radius: 20px;
  border: 3px white double;
  font-size: 14px;
`;

const Category = styled.h3`
  font-size: 14px;
  line-height: 14px;
  text-align: center;
  letter-spacing: 0.05em;
  color: var(--red);
  text-transform: uppercase;
`;

const Image = styled.img`
  max-width: 100%;
  height: 200px;
  margin: 0 auto;
  display: block;
`;
Image.displayName = 'ItemBoxImage'

const Title = styled.h2`
  font-family: MullerMedium;
  font-size: 16px;
  line-height: 110%;
  text-align: center;
  color: var(--black);
  min-height: 52px;
  padding: 0 10px;
  text-transform: uppercase;
  @media screen and (max-width: ${BREAKPOINT}) {
    height: auto;
  }
`;

const PriceBox = styled.div`
  text-align: center;
  margin: 0px 0 10px;
  padding: 0 10px;
`;

const Price = styled.span`
  font-family: MullerBold;
  font-size: 16px;
  line-height: 16px;
  color: var(--red);
`;

const DiscountPrice = styled.span`
  color: var(--red);
  font-size: 14px;
  margin-left: 5px;
  text-decoration: line-through;
`;

const Pill = styled.div`
  border: 1px solid var(--yellow);
  border-radius: 30px;
  display: flex;
  width: fit-content;
  margin: 0 auto;
`;

const Qty = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  select {
    cursor: pointer;
    -webkit-appearance: none;
    background: none;
    border: 0;
    width: 65px;
    padding-left: 30px;
    font-size: 12px;
    line-height: 12px;
  }
  svg {
    pointer-events: none;
    position: absolute;
    right: 0;
  }
`;

const Add = styled.button`
  font-family: MullerBold;
  border: 0;
  background: var(--yellow);
  color: var(--black);
  padding: 11px 20px;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  margin-left: 10px;
  font-size: 10px;
  line-height: 10px;
  text-transform: uppercase;
  transition: all 0.2s linear;
  &:hover {
    background: none;
    color: var(--red);
    box-shadow: 1px 0px var(--yellow) inset;
  }
`;

const EstimatedPrice = styled.div<{ visible?: boolean }>`
  font-family: MullerMedium;
  font-size: 12px;
  line-height: 12px;
  text-align: center;
  color: var(--font);
  padding: 5px 10px;
  opacity: ${props => (props.visible ? 1 : 0)};
`;

const Label = styled.div<{ visible?: boolean }>`
  font-family: MullerBold;
  font-size: 12px;
  line-height: 12px;
  text-align: center;
  color: var(--font);
  padding: 5px 10px;
  opacity: ${props => (props.visible ? 1 : 0)};
`;

const MaxUnits = styled.div`
  font-size: 12px;
  font-family: MullerBold;
  line-height: 12px;
  text-align: center;
  letter-spacing: 0.05em;
  color: var(--red);
  text-transform: uppercase;
`;

const OutOfStock = styled.span`
  font-family: MullerBold;
  border: 0;
  color: var(--black);
  padding: 11px 20px;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  margin-left: 10px;
  font-size: 10px;
  line-height: 10px;
  text-transform: uppercase;
`;

type Props = {
  product: ProductType;
  openModal?: Function;
};

const ItemBox: FC<Props> = ({ product, openModal }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [qty, setQty] = useState<number>(1);
  const { data: userData } = useQuery(GET_USER, {});
  const { data } = useQuery(GET_CART_ITEMS);
  const [addItem] = useMutation(ADD_ITEM, {
    variables: { product: { ...product, qty } }
  });
  const [toggleLoginModal] = useMutation(SET_USER, {
    variables: { user: { openLoginModal: true } }
  });
  const [showSuccess] = useMutation(SET_USER, {
    variables: {
      user: { showModal: t("cart.add_msg", { product: product.name }) }
    }
  });

  const goToProduct = () => {
    if (
      !openModal ||
      window.innerWidth < parseInt(BREAKPOINT.replace("px", ""))
    ) {
      history.push(`/${toLink(product.name)}`);
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 500);
    } else {
      openModal(product);
    }
  };

  const hasStock = () => {
    let p = data.cartItems.find(
      (p: ProductType) => p.entity_id === product.entity_id
    );

    return product.stock >= qty + (p && p.qty ? p.qty : 0);
  };

  const isOverLimit = () => {
    let p = data.cartItems.find(
      (p: ProductType) => p.entity_id === product.entity_id
    );

    return (
      product.maxPerUser > 0 &&
      product.maxPerUser < qty + (p && p.qty ? p.qty : 0)
    );
  };

  const addAndGo = () => {
    // if (userData.userInfo.length && userData.userInfo[0].isLoggedIn) {
    if (isOverLimit()) {
      showSuccess({
        variables: {
          user: {
            showModal: t("cart.over_limit", { units: product.maxPerUser })
          }
        }
      });
    } else if (!hasStock()) {
      showSuccess({
        variables: {
          user: { showModal: t("cart.no_stock", { qty: product.stock }) }
        }
      });
    } else {
      trackAddToCart({ ...product, qty });
      addItem();
      showSuccess();
    }
    // } else {
    //   toggleLoginModal();
    // }
  };

  const discount = (1 - product.special_price / product.price) * 100;

  return (
    <Suspense fallback={<Loader />}>
      <Container>
        {discount > 0 && (
          <Discount>
            <div>{Number(discount).toFixed(0)}</div>
            <div>
              <span>%</span>
              <span>DSCTO</span>
            </div>
          </Discount>
        )}
        <Link onClick={goToProduct}>
          {product.isNew && <NewLabel>{t("itembox.new")}</NewLabel>}
          <Category>{product.category_name}</Category>
          <Image data-src={product.image.split(",")[0]} className="lazyload"></Image>
          <Title>
            {product.useKGS
              ? `${product.name} DE ${Number(product.weight)
                .toFixed(2)
                .replace(".", ",")} KGS APROX.`
              : product.name}
          </Title>
          {product.maxPerUser > 0 && (
            <MaxUnits>
              {t("itembox.max_per_user", { units: product.maxPerUser })}
            </MaxUnits>
          )}
          <EstimatedPrice visible={product.useKGS}>
            Bs.{" "}
            {(product.special_price / product.weight)
              .toFixed(2)
              .replace(".", ",")}
            / KGS
          </EstimatedPrice>
          <Label visible={product.useKGS}>{t("itembox.price_label")}</Label>
          <PriceBox>
            <Price>
              Bs. {(product.special_price || 0).toFixed(2).replace(".", ",")}
            </Price>
            {discount > 0 && (
              <DiscountPrice>
                Bs. {product.price.toFixed(2).replace(".", ",")}
              </DiscountPrice>
            )}
          </PriceBox>
        </Link>
        {
          product.stock > 0 ?
            <Pill>
              <Qty>
                <select
                  defaultValue={1}
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
              <Add onClick={addAndGo}>{t("itembox.add")}</Add>
            </Pill>
            :
            <Pill>
              <OutOfStock>TEMPORALMENTE SIN STOCK</OutOfStock>
            </Pill>
        }
      </Container>
    </Suspense>
  );
};

export default ItemBox;
