import dayjs from "dayjs";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { handleNext, ICoupon } from "../../../../types/Checkout";
import arrow from "../../../../assets/images/arrow-back-checkout.svg";
import edit from "../../../../assets/images/edit-checkout.svg";

import * as SC from "./style";
import useCart from "../../../../hooks/useCart";
import { weekdays } from "../../../../utils/validations";
import Cart from "../Cart";
import { OrderData } from "../../../../types/Order";
import useUser from "../../../../hooks/useUser";
const CallToAction = React.lazy(() => import(/* webpackChunkName: "CallToAction" */ "../../../Cta"));

const previousStep = "payment";
const billingFields = ["firstname", "lastname", "email", "nit"];
const paymentFields = ["method"];
const redirectReview = "&next=review";
const billing = `billing${redirectReview}`;
const timeframe = `timeframe${redirectReview}`;
const shipping = `shipping${redirectReview}`;
const payment = `payment${redirectReview}`;

const getDeliveryDayOfWeek = (deliveryDate: string): string | null => {
  const date = dayjs(deliveryDate);
  if (!date || !date.isValid()) return null;
  return weekdays[date.get("d")] || null;
};
const getDeliveryDate = (deliveryDate: string): string | null => {
  const date = dayjs(deliveryDate);
  if (!date || !date.isValid()) return null;
  return `${date?.get("date") < 10 ? `0${date?.get("date")}` : date?.get("date")}/${date?.get("month") + 1 < 10 ? `0${date?.get("month") + 1}` : date?.get("month") + 1}` || null;
};

const Review = ({ orderData, confirmOrder, updateOrder }: { orderData: OrderData; confirmOrder: Function; updateOrder: (field: string, values: ICoupon) => void }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { totalAmount } = useCart();
  const { store, user: localData } = useUser();

  const paymentMethod: string = useMemo(() => {
    return t("checkout.payment." + orderData?.payment?.method || "checkmo") || "";
  }, [t, orderData, orderData?.payment?.method]);

  const shippingFields = useMemo(
    () => (store === "EXPRESS" ? ["firstname", "lastname", "phone", "nit", "street", "city"] : ["firstname", "lastname", "phone", "nit", "street", "city", "reference"]),
    [store]
  );

  return (
    <>
      <SC.Back.Wrapper onClick={() => handleNext(history, previousStep)}>
        <img src={arrow} alt={t("controls.back_arrow")} width={16} height={11} />
      </SC.Back.Wrapper>
      <SC.Heading>
        <img onClick={() => handleNext(history, previousStep)} src={arrow} alt={t("controls.back_arrow")} width={16} height={11} />
        <h2>{t("checkout.review.heading")}</h2>
      </SC.Heading>
      <SC.Title.Container>
        <SC.Title.Label>{t("checkout.billing.title")}</SC.Title.Label>
        <SC.Title.Link onClick={() => handleNext(history, billing)}>
          <img width={12} height={12} alt={t("controls.edit")} src={edit} />
          {t("account.edit")}
        </SC.Title.Link>
      </SC.Title.Container>

      <SC.Content.Billing.Fields>
        {billingFields.map((field: string) => (
          <SC.Content.InputGroup key={field}>
            <label>{t("checkout.billing." + field)}</label>
            <input
              readOnly
              name={`billing-${field}`}
              // @ts-ignore
              value={orderData.billing[field] || ""}
              pattern={field === "nit" ? "[0-9]*" : ""}
              type={field === "nit" ? "number" : "text"}
              placeholder={t("checkout.billing." + field)}
            />
          </SC.Content.InputGroup>
        ))}
      </SC.Content.Billing.Fields>
      <SC.Title.Container>
        <SC.Title.Label>{t("checkout.delivery.title")}</SC.Title.Label>
        <SC.Title.Link onClick={() => handleNext(history, shipping)}>
          <img width={12} height={12} alt={t("controls.edit")} src={edit} />
          {t("account.edit")}
        </SC.Title.Link>
      </SC.Title.Container>

      <SC.Content.Shipping.Fields>
        {shippingFields.map((key: string) => (
          <SC.Content.InputGroup key={key}>
            <label>{t("checkout.delivery." + key)}</label>
            {key === "reference" && <input readOnly name={`shipping-${key}`} value={orderData.shipping[key] || ""} type="text" placeholder={t("checkout.delivery." + key)} />}
            {key === "street" && (
              <input
                readOnly
                name={`shipping-${key}`}
                value={localData?.userInfo[0]?.expressAltAddress ? localData.userInfo[0].expressAltAddress : orderData.shipping[key] || ""}
                type="text"
                placeholder={t("checkout.delivery." + key)}
              />
            )}
            {key !== "street" && key !== "reference" && (
              <input
                readOnly
                name={`shipping-${key}`}
                // @ts-ignore
                value={key === "phone" && orderData?.shipping[key]?.length > 0 ? String(orderData.shipping[key]).split("|")[0] : orderData.shipping[key] || ""}
                type="text"
                placeholder={t("checkout.delivery." + key)}
              />
            )}
          </SC.Content.InputGroup>
        ))}
      </SC.Content.Shipping.Fields>

      {(store === "B2E" || store === "ECOMMERCE") && (
        <>
          <SC.Title.Container>
            <SC.Title.Label>{t("checkout.delivery_datetime.title")}</SC.Title.Label>
            <SC.Title.Link onClick={() => handleNext(history, timeframe)}>
              <img width={12} height={12} alt={t("controls.edit")} src={edit} />
              {t("account.edit")}
            </SC.Title.Link>
          </SC.Title.Container>
          <SC.Content.Timeframe.Fields>
            <SC.Content.Timeframe.Info key={"delivery_date"}>
              {/* e.g Jueves */}
              {getDeliveryDayOfWeek(orderData?.delivery_date || "")} {/* e.g 04/02 */}
              {getDeliveryDate(orderData?.delivery_date || "")} {/* e.g 13:00 - 17:00 */}
              {orderData.vh_inicio}
              {" - "}
              {orderData.vh_fin}
            </SC.Content.Timeframe.Info>
          </SC.Content.Timeframe.Fields>
        </>
      )}

      <SC.Title.Container>
        <SC.Title.Label>{t("checkout.payment.title")}</SC.Title.Label>
        <SC.Title.Link onClick={() => handleNext(history, payment)}>
          <img width={12} height={12} alt={t("controls.edit")} src={edit} />
          {t("account.edit")}
        </SC.Title.Link>
      </SC.Title.Container>

      <SC.Content.Payment.Fields>
        {paymentFields.map((field: string) => (
          <SC.Content.InputGroup key={field}>
            <label>{t("checkout.payment.title").replace("3. ", "")}</label>
            <input readOnly name={`delivery-${field}`} value={paymentMethod} type={"text"} />
          </SC.Content.InputGroup>
        ))}
      </SC.Content.Payment.Fields>

      <SC.Title.Container>
        <SC.Title.Label>{t("checkout.review.heading")}</SC.Title.Label>
      </SC.Title.Container>

      <Cart showGoBack={false} updateOrder={updateOrder} />

      <SC.Footer.Wrapper>
        <SC.Footer.Total>
          <em>{t("checkout.ticket.total")}</em>
          <strong>Bs. {totalAmount}</strong>
        </SC.Footer.Total>
        <SC.Footer.Cta>
          <CallToAction filled text={t("checkout.review.call_to_action")} action={confirmOrder} />
        </SC.Footer.Cta>
      </SC.Footer.Wrapper>
    </>
  );
};

export default Review;
