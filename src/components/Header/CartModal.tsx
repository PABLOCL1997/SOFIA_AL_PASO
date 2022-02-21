import React, { FC, Suspense, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useMutation, useQuery } from "react-apollo";
import { SET_USER } from "../../graphql/user/mutations";
import { GET_USER } from "../../graphql/user/queries";
import { trackGoToCheckoutEvent } from "../../utils/dataLayer";
import { ProductType } from "../../graphql/products/type";

import * as SC from "../CartModal/style";
import useCart from "../../hooks/useCart";

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../Loader"));
const Cta = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../Cta"));
const Delete = React.lazy(() => import(/* webpackChunkName: "Delete" */ "../Images/Delete"));
const Chevron = React.lazy(() => import(/* webpackChunkName: "Chevron" */ "../Images/Chevron"));
const RecommendedProducts = React.lazy(() => import(/* webpackChunkName: "RecommendedProducts" */ "../Checkout/RecommendedProducts"));

type Props = {};

const CartModal: FC<Props> = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { cart, totalAmount, quantity, updateItem, removeRow, empty, closeCartModal } = useCart();
  const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([]);
  const { data: userData } = useQuery(GET_USER, {});

  const [toggleLoginModal] = useMutation(SET_USER, {
    variables: { user: { openLoginModal: true } },
  });

  const checkout = () => {
    if (userData.userInfo.length && !userData.userInfo[0].isLoggedIn) {
      (window as any).navigateToCheckout = true;
      closeCartModal();
      return toggleLoginModal();
    }
    trackGoToCheckoutEvent();
    closeCartModal();
    return history.push("/checkout");
  };

  const getRelatedProducts = () => {
    let relProducts: ProductType[] = [];
    let checkoutItems: number[] = [];
    if (cart && cart.cartItems) {
      cart.cartItems.forEach((el: ProductType) => {
        checkoutItems.push(el.entity_id);
        if (el.related) {
          relProducts = [...relProducts, ...el.related];
        }
      });
      relProducts = relProducts.filter((v: ProductType, i: number, a: ProductType[]) => a.findIndex((t: ProductType) => t.entity_id === v.entity_id) === i);
      relProducts = relProducts.filter((i: ProductType) => !checkoutItems.includes(i.entity_id));
      relProducts = relProducts.sort((a: ProductType, b: ProductType) => (a.entity_id > b.entity_id ? 1 : -1));
      setRelatedProducts(relProducts);
    }
    return relProducts;
  };

  return (
    <Suspense fallback={<Loader />}>
      <SC.ModalCourtain className={(!userData.userInfo.length || userData.userInfo[0].openCartModal) && "visible"}>
        <SC.Modal>
          <SC.Header>
            <SC.Title>{t("cart.title")}</SC.Title>
            <SC.Count>
              <b>{quantity}</b>
              <span>{t("cart.items")}</span>
            </SC.Count>
            <SC.CloseWrapper onClick={() => closeCartModal()}>
              {/* close */}
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2L2 16" stroke="#808080" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
                <path d="M16 16L2 2" stroke="#808080" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
              </svg>
            </SC.CloseWrapper>
          </SC.Header>
            <SC.Items>
              {cart?.cartItems?.map((product: ProductType, i: number) => (
                  <SC.Row key={product.entity_id}>
                    <SC.Image src={product.image.split(",")[0]}></SC.Image>
                    <SC.NameBox>
                      <SC.Name>{product.useKGS ? `${product.name} DE ${Number(product.weight).toFixed(2).replace(".", ",")} KGS APROX.` : product.name}</SC.Name>
                      <SC.Units>&nbsp;</SC.Units>
                    </SC.NameBox>
                    <SC.Qty>
                      <select defaultValue={product.qty} onChange={(event) => updateItem(Number(event.target.value), product)}>
                        {[...(Array(21).keys())].slice(1).map((opt: number, index: number) => (
                          <option key={index} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <Chevron />
                    </SC.Qty>
                    <SC.UnitPrice>Bs. {product.special_price.toFixed(2).replace(".", ",")} c/u -</SC.UnitPrice>
                    <SC.Price>Bs. {(product.special_price * (product.qty ? product.qty : 0)).toFixed(2).replace(".", ",")}</SC.Price>
                    <SC.DeleteWrapper onClick={() => removeRow(product)}>
                      <Delete />
                    </SC.DeleteWrapper>
                  </SC.Row>
                ))}
            </SC.Items>
          <SC.Totals>
            <SC.Subtotal>{t("cart.subtotal")}</SC.Subtotal>
            <SC.Total>Bs. {totalAmount}</SC.Total>
          </SC.Totals>
          <SC.Footer>
            <SC.Disclaimer>{t("cart.disclaimer")}</SC.Disclaimer>
            <SC.Toolbox>
              <SC.Empty onClick={() => empty()}>{t("cart.empty")}</SC.Empty>
              {parseFloat(totalAmount.replace(",", ".")) > 0 && (
                <SC.CtaWrapper>
                  <Cta
                    filled={true}
                    text={t("cart.pay")}
                    action={() => {
                      const relProducts = getRelatedProducts();
                      if (relProducts.length === 0) {
                        checkout();
                      } else {
                        closeCartModal();
                      }
                    }}
                  />
                </SC.CtaWrapper>
              )}
            </SC.Toolbox>
          </SC.Footer>
        </SC.Modal>
      </SC.ModalCourtain>
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
