import React, { FC, Suspense, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CHECK_COUPON } from "../../../graphql/cart/mutations";
import { GET_CART_ITEMS, COMPARE_PRICES } from "../../../graphql/cart/queries";
import { useMutation, useLazyQuery } from "react-apollo";
import { ProductType } from "../../../graphql/products/type";
import { SET_USER } from "../../../graphql/user/mutations";
import useMinimumPrice from "../../../hooks/useMinimumPrice";
import useCityPriceList from "../../../hooks/useCityPriceList";
import * as SC from "./style";
import useUser from "../../../hooks/useUser";
import { CouponType, Steps } from "../../../types/Checkout";
import useCart from "../../../hooks/useCart";
import useCheckout from "../../../hooks/useCheckout";
import { token as StoreToken } from "../../../utils/store";

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../../Loader"));
const Cta = React.lazy(() => import(/* webpackChunkName: "Cta" */ "../../Cta"));

type Props = {
  order: Function;
  updateOrder: Function;
  processing: boolean;
  userData: any;
  userDetails: any;
  ready: boolean;
  step: Steps;
};

const Ticket: FC<Props> = ({ order, updateOrder, processing, userData, userDetails, ready, step }) => {
  const { t } = useTranslation();
  const minimumPrice = useMinimumPrice();
  const { agency, isExpress } = useCityPriceList();
  const { user: localUserData, toggleCartModal } = useUser();
  const { cart, totalAmount, shippingPrice, discountAmount, removeCoupon } = useCart();
  const [type, setType] = useState("");
  const [discount, setDiscount] = useState("0");

  const [showCoupon, setShowCoupon] = useState(false);
  const [coupon, setCoupon] = useState("");
  const {
    checkout: { isGuestOrder },
  } = useCheckout();
  const showConfirmButton = (isGuestOrder && step === Steps.Payment) || step === Steps.Review;

  const [getCartItems] = useLazyQuery(GET_CART_ITEMS, {
    fetchPolicy: "network-only",
    onCompleted: (d) => {
      const prodQty = d.cartItems.map(({ name, qty }: ProductType) => {
        return { name, qty };
      });
      if (localUserData.userInfo[0].idPriceList && localUserData.userInfo[0].idPriceList > 0) {
        getDiscounts({
          variables: {
            city: localUserData?.userInfo[0]?.cityKey || "SC",
            id_price_list: String(localUserData?.userInfo[0]?.idPriceList) || "0",
            prodQty,
          },
        });
      }
    },
  });

  const [getDiscounts, { data: dataDiscounts }] = useLazyQuery(COMPARE_PRICES, {
    fetchPolicy: "network-only",
  });
  const [checkCoupon] = useMutation(CHECK_COUPON, {
    variables: { name: coupon },
  });
  const [saveCoupon] = useMutation(SET_USER, {});
  const [showError] = useMutation(SET_USER, {
    variables: { user: { showError: t("checkout.ticket.coupon.error") } },
  });

  const addCoupon = async () => {
    try {
      const response: any = await checkCoupon();
      const discount_code: string = response?.data?.coupon?.code;
      const discount_type: CouponType = response?.data?.coupon?.type;
      await saveCoupon({
        variables: { user: { coupon: discount_code } },
      });
      setType(discount_type);
      setCoupon(discount_code);
    } catch (e) {
      showError();
      await saveCoupon({
        variables: { user: { coupon: null } },
      });
    }
  };

  useEffect(() => {
    updateOrder("coupon", {
      coupon,
      discount: Number(discount),
      type,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discount]);

  useEffect(() => {
    getCartItems();
  }, [localUserData]);

  return (
    <Suspense fallback={<Loader />}>
      <SC.Container>
        <SC.Title>
          <h2>{t("checkout.ticket.title")}</h2>
          <button onClick={() => toggleCartModal()}>{t("checkout.modify_cart")}</button>
        </SC.Title>
        <SC.Rows>
          {cart?.cartItems?.map((product: ProductType, index: number) => (
            <SC.Row key={product.entity_id}>
              <span>
                {product.qty} x {product.useKGS ? `${product.name} DE ${Number(product.weight).toFixed(2).replace(".", ",")} KGS APROX.` : product.name}
              </span>
              <span>
                Bs.{" "}
                {Number((product?.qty ?? 0) * product.special_price)
                  .toFixed(2)
                  .replace(".", ",")}
              </span>
            </SC.Row>
          ))}
        </SC.Rows>
        <SC.Shipping>
          <span>{t("checkout.ticket.delivery")}</span>
          {shippingPrice ? <b>Bs. {String(shippingPrice.toFixed(2)).replace(".", ",")}</b> : <b>GRATIS</b>}
        </SC.Shipping>
        {Number(discountAmount) > 0 && (
          <SC.Discount>
            <span>{t("checkout.ticket.discount")}</span>
            <span>- Bs. {String(discountAmount).replace(".", ",")}</span>
          </SC.Discount>
        )}
        <SC.Subtotal key={`ticketsubtotal${totalAmount}`}>
          <b>{t("checkout.ticket.subtotal")}</b>
          <b>Bs. {totalAmount}</b>
        </SC.Subtotal>
        {/* only on b2c */}
        {(localUserData && localUserData?.userInfo[0]?.id && localUserData?.userInfo[0]?.store !== "PICKUP") || StoreToken.get() !== "null" ? (
          <SC.Coupon>
            {!showCoupon && <button onClick={() => setShowCoupon(true)}>{t("checkout.ticket.coupon.ask")}</button>}
            {showCoupon && (
              <SC.InputBox>
                <input value={coupon} onChange={(evt) => setCoupon(evt.target.value)} type="text" placeholder={t("checkout.ticket.coupon.placeholder")} />
                {Number(discount) === 0 && (
                  <button onClick={addCoupon} className="add">
                    {t("checkout.ticket.coupon.add")}
                  </button>
                )}
                {Number(discount) > 0 && <button onClick={() => removeCoupon()}>{t("checkout.ticket.coupon.delete")}</button>}
              </SC.InputBox>
            )}
          </SC.Coupon>
        ) : null}

        <SC.Line />
        <SC.Total key={`tickettotal${totalAmount}`}>
          <b>{t("checkout.ticket.total")}</b>
          <b>Bs. {(Number(totalAmount.replace(",", ".")) + shippingPrice).toFixed(2).replace(".", ",")}</b>
        </SC.Total>
        {dataDiscounts &&
          !localUserData?.userInfo[0]?.agency &&
          !!(localUserData && localUserData?.userInfo[0]?.idPriceList && localUserData?.userInfo[0]?.idPriceList > 0) &&
          userDetails.details.employee && (
            <SC.EmployeeMsg>
              ¡Te has ahorrado Bs.{" "}
              {Number(dataDiscounts?.comparePrices || 0)
                .toFixed(2)
                .replace(".", ",")}{" "}
              por ser colaborador!
            </SC.EmployeeMsg>
          )}
        {showConfirmButton ? (
          <SC.CtaWrapper>
            {!processing && <Cta active={ready && Number(totalAmount.replace(",", ".")) > 0} text={t("checkout.ticket.send")} action={order} filled />}
            {processing && (
              <SC.LoaderWrapper>
                <img src="/images/loader.svg" width="50px" height="50px" alt="loader" />
              </SC.LoaderWrapper>
            )}
          </SC.CtaWrapper>
        ) : null}
        {shippingPrice > 0 ? <SC.ErrorText margin={false}>A partir de Bs. {minimumPrice} el envio es gratis.</SC.ErrorText> : null}
      </SC.Container>
    </Suspense>
  );
};

export default Ticket;
