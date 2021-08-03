import React, { FC, Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-apollo";
import useMinimumPrice from "../../hooks/useMinimumPrice";

import { SET_USER } from "../../graphql/user/mutations";
import { GET_USER } from "../../graphql/user/queries";
import {  trackGoToCheckoutEvent } from "../../utils/dataLayer";

import { useHistory } from "react-router-dom";
import { ProductType } from "../../graphql/products/type";

import {
  CloseWrapper,
  Count,
  CtaWrapper,
  DeleteWrapper,
  Disclaimer,
  Empty,
  Footer,
  Header,
  Items,
  Image,
  LoaderWrapper,
  Modal,
  ModalCourtain,
  Name,
  NameBox,
  Price,
  Qty,
  Row,
  Subtotal,
  Title,
  Toolbox,
  Total,
  Totals,
  UnderBudget,
  UnitPrice,
  Units
} from "../CartModal/style"

import useCart from "../../hooks/useCart";

const Loader = React.lazy(() =>
  import(/* webpackChunkName: "Loader" */ "../Loader")
);

const Cta = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../Cta"));

const Delete = React.lazy(
  () => import(/* webpackChunkName: "Delete" */ "../Images/Delete")
);

const Chevron = React.lazy(
  () => import(/* webpackChunkName: "Chevron" */ "../Images/Chevron")
);

const RecommendedProducts = React.lazy(
  () => import(/* webpackChunkName: "RecommendedProducts" */ "../Checkout/RecommendedProducts")
);


type Props = {};

const CartModal: FC<Props> = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const minimumPrice = useMinimumPrice()
  const { cart, totalAmount, quantity, updateItem, removeRow, empty, closeCartModal } = useCart()

  const [relatedProducts, setRelatedProducts] = useState<any>([]);
  const { data: userData } = useQuery(GET_USER, {});

  const [toggleLoginModal] = useMutation(SET_USER, {
    variables: { user: { openLoginModal: true } }
  });

  const checkout = () => {
    trackGoToCheckoutEvent();
    closeCartModal();
    if (userData.userInfo.length && !userData.userInfo[0].isLoggedIn) {
      (window as any).navigateToCheckout = true;
      toggleLoginModal();
    }
    history.push("/checkout");
  };

  const getRelatedProducts = () => {
    let relProducts: any = [];
    let checkoutItems: any = [];
    if (cart && cart.cartItems) {
      cart.cartItems.forEach((el: any) => {
        checkoutItems.push(el.entity_id);
        if(el.related){
          relProducts = [...relProducts, ...el.related];
        }
      })
      relProducts = relProducts.filter((v:any,i:any,a:any)=>a.findIndex((t:any)=>(t.entity_id === v.entity_id))===i)
      relProducts = relProducts.filter((i:any) => !checkoutItems.includes(i.entity_id))
      relProducts = relProducts.sort((a:any, b:any) => (a.entity_id > b.entity_id) ? 1 : -1);
      setRelatedProducts(relProducts);
    }
    return relProducts
  }

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
              <b>{quantity}</b>
              <span>{t("cart.items")}</span>
            </Count>
            <CloseWrapper onClick={() => closeCartModal()}>
              {/* close */}
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2L2 16" stroke="#808080" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
                <path d="M16 16L2 2" stroke="#808080" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
              </svg>
            </CloseWrapper>
          </Header>
          {parseFloat(totalAmount.replace(",", ".")) <
            minimumPrice && (
            <UnderBudget>
              {t("cart.under_budget", { min_price: minimumPrice })}
            </UnderBudget>
          )}

          {cart && cart.cartItems && cart.cartItems.length > 0 ? (
            <Items>
              {cart &&
                cart.cartItems &&
                cart.cartItems
                  .map((product: ProductType, i: number) => (
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
          ) : (
            <div>
              <LoaderWrapper>
              </LoaderWrapper>
            </div>
          )}
          <Totals>
            <Subtotal>{t("cart.subtotal")}</Subtotal>
            <Total>Bs. {totalAmount}</Total>
          </Totals>
          <Footer>
            <Disclaimer>{t("cart.disclaimer")}</Disclaimer>
            <Toolbox>
              <Empty onClick={() => empty()}>{t("cart.empty")}</Empty>
              {parseFloat(totalAmount.replace(",", ".")) >=
                minimumPrice && (
                <CtaWrapper>
                  <Cta filled={true} text={t("cart.pay")} action={() => {
                    const relProducts = getRelatedProducts();
                    if(relProducts.length == 0){
                      checkout();
                    } else {
                      closeCartModal();
                    }
                  }} />
                </CtaWrapper>
              )}
            </Toolbox>
          </Footer>
        </Modal>
      </ModalCourtain>
      <RecommendedProducts
        visible={relatedProducts.length > 0}
        items={relatedProducts}
        close={() => {
          setRelatedProducts([]);
          checkout();
        }}
      />
    </Suspense>
  );
};

export default CartModal;
