import { useMutation, useQuery } from "@apollo/react-hooks";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import * as SC from "../components/CartModal/style";
import { ProductType } from "../graphql/products/type";
import { SET_USER } from "../graphql/user/mutations";
import { GET_USER } from "../graphql/user/queries";
import useCart from "../hooks/useCart";
import { trackGoToCheckoutEvent, trackViewCart } from "../utils/dataLayer";
import { keepQueryParameter } from "../utils/string";

const Cta = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../components/Cta"));
const Delete = React.lazy(() => import(/* webpackChunkName: "Delete" */ "../components/Images/Delete"));
const Chevron = React.lazy(() => import(/* webpackChunkName: "Chevron" */ "../components/Images/Chevron"));
const RecommendedProducts = React.lazy(() => import(/* webpackChunkName: "RecommendedProducts" */ "../components/Checkout/RecommendedProducts"));

const Cart = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { cart, totalAmount, quantity, updateItem, removeRow, empty, closeCartModal } = useCart();
  const [relatedProducts, setRelatedProducts] = useState<Array<ProductType>>([]);
  const { data: userData } = useQuery(GET_USER, {});

  const [toggleLoginModal] = useMutation(SET_USER, {
    variables: { user: { openLoginModal: true } },
  });

  const checkout = () => {
    trackGoToCheckoutEvent(cart?.cartItems);
    closeCartModal();
    if (userData?.userInfo?.length && !userData?.userInfo[0]?.isLoggedIn) {
      (window as any).navigateToCheckout = true;
      toggleLoginModal();
    }
    history.push(keepQueryParameter(`/checkout`));
  };

  useEffect(() => {
    if (cart?.cartItems) {
      trackViewCart(cart?.cartItems);
    }
  }, [cart?.cartItems]);

  const getRelatedProducts = () => {
    let relProducts: ProductType[] = [];
    let checkoutItems: number[] = [];
    if (cart?.cartItems) {
      cart?.cartItems?.forEach((el: ProductType) => {
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
    <SC.Page>
      <SC.Modal>
        <SC.Header>
          <SC.Title>{t("cart.title")}</SC.Title>
          <SC.Count>
            <b>{quantity}</b>
            <span>{t("cart.items")}</span>
          </SC.Count>
        </SC.Header>
        {cart?.cartItems?.length > 0 ? (
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
                    {[...Array(21).keys()].slice(1).map((opt: number, index: number) => (
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
        ) : (
          <div>
            <SC.LoaderWrapper></SC.LoaderWrapper>
          </div>
        )}
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

      <RecommendedProducts
        visible={relatedProducts.length > 0}
        items={relatedProducts}
        close={() => {
          setRelatedProducts([]);
          checkout();
        }}
      />
    </SC.Page>
  );
};

export default Cart;
