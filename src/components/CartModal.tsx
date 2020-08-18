import React, { FC, Suspense, useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { BREAKPOINT } from "../utils/constants";
import { useMutation, useQuery } from "react-apollo";
import { SET_USER } from "../graphql/user/mutations";
import { GET_USER } from "../graphql/user/queries";
import { trackAddToCart, trackRemoveFromCart } from "../utils/dataLayer";
import {
  GET_CART_ITEMS,
  GET_TOTAL,
  GET_QTY,
  CHECK_CART,
  GET_MIN_PRICE
} from "../graphql/cart/queries";
import { useHistory } from "react-router-dom";
import { ProductType } from "../graphql/products/type";
import { ADD_ITEM, DELETE_ITEM, EMPTY_CART } from "../graphql/cart/mutations";

const Loader = React.lazy(() =>
  import(/* webpackChunkName: "Loader" */ "./Loader")
);
const Cta = React.lazy(() => import(/* webpackChunkName: "Loader" */ "./Cta"));
const Close = React.lazy(() =>
  import(/* webpackChunkName: "Close" */ "./Images/Close")
);
const Chevron = React.lazy(() =>
  import(/* webpackChunkName: "Chevron" */ "./Images/Chevron")
);
const Delete = React.lazy(() =>
  import(/* webpackChunkName: "Delete" */ "./Images/Delete")
);

const ModalCourtain = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  z-index: 4;
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  &.visible {
    display: flex;
  }
`;

const Modal = styled.div`
  position: relative;
  padding: 42px;
  background: white;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 380px;
  max-width: 100%;

  @media screen and (max-width: ${BREAKPOINT}) {
    min-width: 100%;
    padding: 20px;
    height: 100vh;
    border-radius: 0;
  }
`;

const CloseWrapper = styled.div`
  cursor: pointer;
  svg {
    margin-top: 4px;
    margin-left: 30px;
    path {
      stroke: var(--red);
    }
  }
  &:hover {
    opacity: 0.8;
  }
`;

const Qty = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid var(--yellow);
  padding: 10px 0;
  border-radius: 30px;
  margin-right: 20px;
  @media screen and (max-width: ${BREAKPOINT}) {
    margin-right: 0;
  }
  select {
    cursor: pointer;
    -webkit-appearance: none;
    background: none;
    border: 0;
    width: 65px;
    padding-left: 25px;
    font-size: 12px;
    line-height: 12px;
  }
  svg {
    pointer-events: none;
    position: absolute;
    right: 10px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  width: calc(100% + 84px);
  padding: 30px;
  margin-top: -42px;
  box-shadow: 0px 6px 74px rgba(0, 0, 0, 0.1);

  @media screen and (max-width: ${BREAKPOINT}) {
    padding: 40px 50px 15px;
  }
`;

const Title = styled.h2`
  font-family: MullerMedium;
  font-size: 24px;
  line-height: 24px;
  color: var(--black);
  flex: 1;
`;

const Count = styled.span`
  font-family: MullerMedium;
  font-size: 16px;
  line-height: 16px;
  span {
    font-family: MullerMedium;
  }
  b {
    color: var(--red);
    margin-right: 8px;
  }
`;

const UnderBudget = styled.div`
  background: var(--red);
  width: calc(100% + 84px);
  padding: 20px;
  color: white;
  text-align: center;
  font-family: MullerBold;
  text-transform: uppercase;
  font-size: 12px;
  @media screen and (max-width: ${BREAKPOINT}) {
    width: calc(100% + 40px);
    margin-top: 10px;
  }
`;

const Items = styled.div`
  max-height: calc(100vh - 300px);
  overflow: auto;

  @media screen and (max-width: ${BREAKPOINT}) {
    max-width: calc(100% - 40px);
    max-height: calc(100vh - 320px);
    height: calc(100vh - 320px);
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 115px 1fr 95px 95px 100px 24px;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #ccc;
  width: 100%;
  @media screen and (max-width: ${BREAKPOINT}) {
    grid-template-columns: 115px 1fr 70px;
  }
`;

const Image = styled.img`
  width: 100px;
  margin-right: 20px;
`;

const NameBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 20px;
  flex: 1;
`;

const Name = styled.h3`
  font-family: MullerMedium;
  font-size: 14px;
  line-height: 14px;
  color: var(--black);
  margin-bottom: 5px;
`;

const Units = styled.span`
  font-family: MullerMedium;
  font-size: 12px;
  line-height: 12px;
  color: var(--font);
  margin-right: 20px;
`;

const UnitPrice = styled.span`
  font-family: MullerMedium;
  font-size: 12px;
  line-height: 12px;
  color: var(--font);
  margin-right: 5px;
`;

const Price = styled.span`
  margin-right: 20px;
  font-family: MullerMedium;
  font-size: 16px;
  line-height: 16px;
`;

const DeleteWrapper = styled.div`
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  @media screen and (max-width: ${BREAKPOINT}) {
    text-align: center;
  }
`;

const Totals = styled.div`
  padding: 30px 15px;
  display: flex;
  width: 100%;
`;

const Subtotal = styled.span`
  flex: 1;
  font-family: MullerMedium;
  font-size: 16px;
  line-height: 16px;
`;

const Total = styled.span`
  font-family: MullerMedium;
  font-size: 18px;
  line-height: 18px;
  color: var(--red);
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 15px;

  @media screen and (max-width: ${BREAKPOINT}) {
    flex-direction: column;
  }
`;
const Disclaimer = styled.p`
  max-width: 290px;
  font-size: 11px;
  line-height: 18px;
  padding-right: 30px;

  @media screen and (max-width: ${BREAKPOINT}) {
    margin-bottom: 20px;
  }
`;

const Toolbox = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`;

const Empty = styled.button`
  font-family: MullerMedium;
  font-size: 14px;
  line-height: 20px;
  color: var(--black);
  background: none;
  border: 0;
  &:hover {
    opacity: 0.8;
  }
`;

const CtaWrapper = styled.div`
  margin-left: 20px;
  button {
    padding: 10px 50px;
    text-transform: uppercase;
    span {
      font-size: 14px;
    }
  }
`;

type Action = {
  qty?: number;
  product?: ProductType;
  action?: string;
};

type Props = {};

const AuthModal: FC<Props> = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { data } = useQuery(GET_CART_ITEMS);
  const [action, setAction] = useState<Action>({});
  const { data: userData } = useQuery(GET_USER, {});
  const [closeCartModal] = useMutation(SET_USER, {
    variables: { user: { openCartModal: false } }
  });
  const [addItem] = useMutation(ADD_ITEM, {
    variables: {
      product: { ...action.product, qty: action.qty, replace: true }
    }
  });
  const [deleteItem] = useMutation(DELETE_ITEM, {
    variables: { product: { ...action.product } }
  });
  const [emptyCart] = useMutation(EMPTY_CART, { variables: {} });
  const [shouldExecute, executeNewCartQuery] = useState(false);
  const [newCartEmpty, setNewCartEmpty] = useState(true);
  const { data: newCart } = useQuery(CHECK_CART, {
    variables: {
      cart: JSON.stringify(
        data.cartItems.map((p: ProductType) => ({
          entity_id: p.entity_id,
          qty: p.qty
        }))
      ),
      city: userData && userData.userInfo.length && userData.userInfo[0].cityKey
    },
    fetchPolicy: "network-only",
    skip: !shouldExecute
  });
  const [showSuccess] = useMutation(SET_USER, {
    variables: { user: { showModal: t("cart.change_msg") } }
  });

  const totalAmount = GET_TOTAL(data.cartItems);

  const updateItem = (_qty: number, _product: ProductType) => {
    setAction({
      qty: _qty,
      product: _product,
      action: "add"
    });
  };

  const removeRow = (_product: ProductType) => {
    setAction({
      product: _product,
      action: "delete"
    });
  };

  const empty = () => {
    setAction({
      action: "empty"
    });
  };

  const hasStock = () => {
    let p = data.cartItems.find(
      (p: ProductType) => p.entity_id === action.product?.entity_id
    );

    return (
      (action.product?.stock ?? 0) >=
      (action.qty || 0) + (p && p.qty ? p.qty : 0)
    );
  };

  const isOverLimit = () => {
    let p = data.cartItems.find(
      (p: ProductType) => p.entity_id === action.product?.entity_id
    );

    return (
      (action.product?.maxPerUser ?? 0) > 0 &&
      (action.product?.maxPerUser ?? 0) <
        (action.qty || 0) + (p && p.qty ? p.qty : 0)
    );
  };

  const doAction = async (action: Action) => {
    if (action.action === "add") {
      if (isOverLimit()) {
        showSuccess({
          variables: {
            user: {
              showModal: t("cart.over_limit", {
                units: action.product?.maxPerUser ?? 0
              })
            }
          }
        });
      } else if (!hasStock()) {
        return showSuccess({
          variables: {
            user: {
              showModal: t("cart.no_stock", { qty: action.product?.stock ?? 0 })
            }
          }
        });
      }
      if ((action.product?.qty ?? 0) < (action.qty || 0)) {
        trackRemoveFromCart({
          ...action.product,
          qty: action.qty
        } as ProductType);
      } else {
        trackAddToCart({ ...action.product, qty: action.qty } as ProductType);
      }
      await addItem();
      setAction({});
    } else if (action.action === "delete") {
      trackRemoveFromCart({
        ...action.product,
        qty: 0
      } as ProductType);
      await deleteItem();
      setAction({});
      if (data && !data.cartItems.length) closeCartModal();
    } else if (action.action === "empty") {
      await emptyCart();
      setAction({});
      closeCartModal();
    }
  };

  const checkout = () => {
    closeCartModal();
    history.push("/checkout");
  };

  const showCityWarning = () => {
    showSuccess({
      variables: { user: { showModal: t("cart.city_warning") } }
    });
  };

  useEffect(() => {
    if (newCart && newCart.checkCart && !newCartEmpty) {
      executeNewCartQuery(false);
      setNewCartEmpty(true);
      (async () => {
        let cartItems = JSON.parse(newCart.checkCart.cart);
        if (!cartItems.length) return;
        let _oldItems = [...data.cartItems];
        let originalLength = _oldItems.length;
        // await emptyCart();
        for (let i = 0; i < cartItems.length; i++) {
          let elem: ProductType = _oldItems.find(
            (p: ProductType) => p.entity_id === cartItems[i].entity_id
          );
          if (cartItems[i].qty === 0) {
            await deleteItem({
              variables: { product: { ...elem } }
            });
          } else {
            await addItem({
              variables: {
                product: {
                  ...cartItems[i],
                  replace: true
                }
              }
            });
          }
        }
        let new_total = cartItems.reduce((sum: number, i: any) => {
          return sum + (i.qty === 0 ? 0 : i.price * i.qty);
        }, 0);
        if (
          userData &&
          userData.userInfo.length &&
          userData.userInfo[0].id &&
          !!originalLength
        ) {
          if (
            history.location.pathname.indexOf("checkout") >= 0 &&
            new_total < 100
          ) {
            history.push("/");
            showSuccess({
              variables: { user: { showModal: t("cart.change_qty_msg") } }
            });
          } else {
            showSuccess();
          }
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newCart]);

  useEffect(() => {
    doAction(action);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action]);

  useEffect(() => {
    closeCartModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   if (history.location.pathname.indexOf("checkout") >= 0) {
  //     if (parseFloat(totalAmount.replace(",", ".")) < 200) {
  //       history.push("/");
  //     }
  //   }
  // }, [totalAmount]);

  useEffect(() => {
    if (!newCartEmpty) {
      executeNewCartQuery(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newCartEmpty]);

  useEffect(() => {
    const _w: any = window;
    if (userData && userData.userInfo.length) {
      if (_w.currentCity && _w.currentCity !== userData.userInfo[0].cityName) {
        // if (userData.userInfo[0].cityKey !== "SC") showCityWarning();
        if (newCartEmpty) setNewCartEmpty(false);
      }
      _w.currentCity = userData.userInfo[0].cityName;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  return (
    <Suspense fallback={<Loader />}>
      <ModalCourtain
        className={
          (!userData.userInfo.length || userData.userInfo[0].openCartModal) &&
          "visible"
        }
      >
        <Modal>
          <Header>
            <Title>{t("cart.title")}</Title>
            <Count>
              <b>{GET_QTY(data.cartItems)}</b>
              <span>{t("cart.items")}</span>
            </Count>
            <CloseWrapper onClick={() => closeCartModal()}>
              <Close />
            </CloseWrapper>
          </Header>
          {parseFloat(totalAmount.replace(",", ".")) <
            GET_MIN_PRICE(userData) && (
            <UnderBudget>
              {t("cart.under_budget", { min_price: GET_MIN_PRICE(userData) })}
            </UnderBudget>
          )}
          <Items>
            {data &&
              data.cartItems &&
              data.cartItems
                .sort(
                  (a: ProductType, b: ProductType) => a.entity_id - b.entity_id
                )
                .map((product: ProductType) => (
                  <Row key={product.entity_id}>
                    <Image src={product.image.split(",")[0]}></Image>
                    <NameBox>
                      <Name>
                        {product.useKGS
                          ? `${product.name} DE ${Number(product.weight)
                              .toFixed(2)
                              .replace(".", ",")} KGS APROX.`
                          : product.name}
                      </Name>
                      <Units>&nbsp;</Units>
                    </NameBox>
                    <Qty>
                      <select
                        defaultValue={product.qty}
                        onChange={event =>
                          updateItem(Number(event.target.value), product)
                        }
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
                    <UnitPrice>
                      Bs. {product.special_price.toFixed(2).replace(".", ",")}{" "}
                      c/u -
                    </UnitPrice>
                    <Price>
                      Bs.{" "}
                      {(product.special_price * (product.qty ? product.qty : 0))
                        .toFixed(2)
                        .replace(".", ",")}
                    </Price>
                    <DeleteWrapper onClick={() => removeRow(product)}>
                      <Delete />
                    </DeleteWrapper>
                  </Row>
                ))}
          </Items>
          <Totals>
            <Subtotal>{t("cart.subtotal")}</Subtotal>
            <Total>Bs. {totalAmount}</Total>
          </Totals>
          <Footer>
            <Disclaimer>{t("cart.disclaimer")}</Disclaimer>
            <Toolbox>
              <Empty onClick={() => empty()}>{t("cart.empty")}</Empty>
              {parseFloat(totalAmount.replace(",", ".")) >=
                GET_MIN_PRICE(userData) && (
                <CtaWrapper>
                  <Cta filled={true} text={t("cart.pay")} action={checkout} />
                </CtaWrapper>
              )}
            </Toolbox>
          </Footer>
        </Modal>
      </ModalCourtain>
    </Suspense>
  );
};

export default AuthModal;
