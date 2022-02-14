import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { ProductType } from "../../../../graphql/products/type";
import useCart from "../../../../hooks/useCart";
import * as SC from "./style"
import * as ESC from "../../Ticket/style"
import useCityPriceList from "../../../../hooks/useCityPriceList";
import useUser from "../../../../hooks/useUser";
import { useMutation } from "@apollo/react-hooks";
import { CHECK_COUPON } from "../../../../graphql/cart/mutations";
import { SET_USER } from "../../../../graphql/user/mutations";
import { CouponType, ICoupon } from "../../../../types/Checkout";

const CallToAction = React.lazy(() => import(/* webpackChunkName: "CallToAction" */ "../../../Cta"));

function useUrlQuery() {
  return new URLSearchParams(useLocation().search);
}

const Cart: FC<{
    showGoBack: boolean,
    updateOrder: (field: string, values: ICoupon) => void
  }> = ({
    showGoBack = true,
    updateOrder
  }) => {
  const { t } = useTranslation();
  const history = useHistory();
  let query = useUrlQuery();
  let nextUrl = query.get("next") || "billing";

  const { agency, idPriceList } = useCityPriceList();
  const { user, coupon: _coupon } = useUser();
  const { cart, totalAmount, shippingPrice, discountAmount, removeCoupon } = useCart();
  const [showCoupon, setShowCoupon] = useState(false);
  const [coupon, setCoupon] = useState(""); // input
  const [type, setType] = useState<CouponType>("%");

  const [saveCoupon] = useMutation(SET_USER, {});
  const [checkCoupon] = useMutation(CHECK_COUPON, {
    variables: { name: coupon },
  });
  const [showError] = useMutation(SET_USER, {
    variables: { user: { showError: t("checkout.ticket.coupon.error") } },
  });

  const handleGoToCheckout = () => history.push(`/checkout?step=${nextUrl}`);

  const addCoupon = async () => {
    try {
      const response: any = await checkCoupon();
      const discount_code: string = response?.data?.coupon?.code;
      const discount_type: CouponType = response?.data?.coupon?.type
      await saveCoupon({
        variables: { user: { coupon: discount_code } },
      })
      setType(discount_type);
      setCoupon(discount_code);
    } catch (e) {
      showError();
      await saveCoupon({
        variables: { user: { coupon: null } },
      })
    }
  };

  useEffect(() => {
    updateOrder("coupon", {
      coupon: _coupon,
      type,
      discount: discountAmount,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discountAmount, type, _coupon]);

  useEffect(() => {
    if (_coupon) {
      setShowCoupon(true);
      setCoupon(_coupon);
    }
  }, [_coupon])

  return (
    <>
      {cart?.cartItems?.map((product: ProductType) => (
        <SC.Content.Container>
          <SC.Content.Name>
            {t("product.name", {
              name: product.name,
              kgs: product.weight,
              context: product.useKGS ? "with_kgs" : "without_kgs"
            })}
          </SC.Content.Name>
          <SC.Content.Price>Bs. {(product.special_price * (product.qty ? product.qty : 0)).toFixed(2).replace(".", ",")}</SC.Content.Price>
        </SC.Content.Container>
      ))}

      {!agency && (
        <ESC.Shipping style={{ marginTop: "30px" }}>
          <span>{t("checkout.ticket.delivery")}</span>
          {shippingPrice ?
            <b>Bs. {String(shippingPrice.toFixed(2)).replace('.', ',')}</b>
            :
            <b>GRATIS</b>
          }
        </ESC.Shipping>
      )}

      {user && !agency && !idPriceList ? (
        <ESC.Coupon>
          {!showCoupon && <button onClick={() => setShowCoupon(true)}>{t("checkout.ticket.coupon.ask")}</button>}
          {showCoupon && (
            <ESC.InputBox>
              <input value={coupon} onChange={(evt) => setCoupon(evt.target.value)} type="text" placeholder={t("checkout.ticket.coupon.placeholder")} />
              {discountAmount === 0 && (
                <button onClick={addCoupon} className="add">
                  {t("checkout.ticket.coupon.add")}
                </button>
              )}
              {discountAmount > 0 && <button onClick={() => removeCoupon()}>{t("checkout.ticket.coupon.delete")}</button>}
            </ESC.InputBox>
          )}
        </ESC.Coupon>
      ) : null}
      {discountAmount > 0 && (
        <ESC.Discount>
          <span>{t("checkout.ticket.discount")}</span>
          <span>- Bs. {discountAmount.toFixed(2).replace(".", ",")}</span>
        </ESC.Discount>
      )}

      <SC.Content.Subtotal.Wrapper>
        <SC.Content.Subtotal.Tag>Subtotal</SC.Content.Subtotal.Tag>
        <SC.Content.Subtotal.Price>Bs. {totalAmount}</SC.Content.Subtotal.Price>
      </SC.Content.Subtotal.Wrapper>
      {showGoBack &&
        <SC.Footer.Wrapper>
          <SC.Footer.Cta>
            <CallToAction
              filled={true}
              text={t("checkout.cart.call_to_action")}
              action={handleGoToCheckout}
            />
          </SC.Footer.Cta>
        </SC.Footer.Wrapper>
      }
    </>
  );
}

export default Cart