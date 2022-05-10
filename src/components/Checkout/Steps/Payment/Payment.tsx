import React, { FC, Suspense, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLazyQuery } from "react-apollo";
import { useHistory } from "react-router-dom";
import { CLIENT_CREDIT } from "../../../../graphql/b2e/queries";
import { handleNext } from "../../../../types/Checkout";
import useUser from "../../../../hooks/useUser";
import CircleLoader from "../../../CircleLoader";
import arrow from "../../../../assets/images/arrow-back-checkout.svg";
import * as SC from "./style";
import { useUrlQuery } from "../../../../hooks/useUrlQuery";
import Cta from "../../../Cta";
import useCheckout from "../../../../hooks/useCheckout";

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../../../Loader"));
const Switch = React.lazy(() => import(/* webpackChunkName: "Switch" */ "../../../Switch"));
const CallToAction = React.lazy(() => import(/* webpackChunkName: "CallToAction" */ "../../../Cta"));

const previousStep = "shipping";

const Payment: FC<{
  updateOrder: (field: string, value: { method: string }) => void;
  userDetails: any;
  totalAmount: any;
  setOrderIsReady: Function;
  orderData: any,
  order: () => void;
}> = ({
  updateOrder,
  userDetails,
  totalAmount,
  setOrderIsReady,
  orderData,
  order
}) => {
  const { t } = useTranslation();
  const { store } = useUser();
  const history = useHistory();
  const query = useUrlQuery();
  const nextStep = query.get("next") || "review";
  const { checkout: { isGuestOrder } } = useCheckout();
  const [isProcessing, setIsProcessing] = useState(false);

  const CREDIT = {
    title: "credito",
    value: "ccsave",
  };
  const POS = {
    title: t("checkout.payment.checkmo"),
    value: "checkmo",
  };
  const TODOTIX = {
    title: t("checkout.payment.todotix"),
    value: "todotix",
  };
  const CASH = {
    title: t("checkout.payment.cashondelivery"),
    value: "cashondelivery",
  };

  const paymentConfig = {
    'EXPRESS': [CASH],
    'PICKUP': [CASH, POS],
    'ECOMMERCE': [CASH, POS, TODOTIX],
    'B2E': [CASH, POS, TODOTIX, CREDIT],
  }

  const [userCredit, { loading: loadingCredit, data: dataCredit }] = useLazyQuery(CLIENT_CREDIT, {
    fetchPolicy: "network-only",
    onCompleted: (d) => {
      setOrderIsReady(true);
      // actualizar valor para que el cliente sepa si le alcanza.
      if (option === CREDIT.value) {
        parseFloat(totalAmount.replace(",", ".")) < d.getB2EUserCredit.creditoDisponible.toFixed(2) ? setOrderIsReady(true) : setOrderIsReady(false);
      }
    },
  });

  const changeOption = (val: string) => {
    if (val === CREDIT.value) {
      setOrderIsReady(false);
      userCredit({
        variables: {
          idAddress: 0,
          idClient: parseInt(userDetails?.details?.employee) || 0,
        },
      });
    } else {
      setOrderIsReady(true);
    }
    updateOrder("payment", { method: val });
  };

  const handleGuestConfirm = () => {
    setIsProcessing(true);
    order();
  }

  const option = useMemo(() => {
    return orderData?.payment?.method;
  }, [orderData]);

  const options = useMemo(() => {
    if (store) return paymentConfig[store];
    return paymentConfig['ECOMMERCE']
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store]);

  return (
    <Suspense fallback={<Loader />}>
      <SC.Container>
        <SC.Back.Wrapper onClick={() => handleNext(history, previousStep)}>
          <img src={arrow} alt={t("controls.back_arrow")} width={16} height={11} />
        </SC.Back.Wrapper>     
        <SC.Title>
          <img onClick={() => handleNext(history, previousStep)} src={arrow} alt={t("controls.back_arrow")} width={16} height={11} />
          <h2>{t("checkout.payment.title")}</h2>
        </SC.Title>
        <div className="switchContainer">
          <Switch changeOption={changeOption} option={option} values={options} />
        </div>
        <SC.Disclaimer>{t("checkout.payment.bs_only")}</SC.Disclaimer>
        {option === CREDIT.value && (
          <React.Fragment>
            {loadingCredit && <CircleLoader noHeight={true} />}
            {!loadingCredit && dataCredit && (
              <p style={parseFloat(totalAmount.replace(",", ".")) < dataCredit.getB2EUserCredit.creditoDisponible.toFixed(2) ? SC.green : SC.red}>
                Crédito Bs. {String(dataCredit.getB2EUserCredit.creditoDisponible.toFixed(2)).replace(".", ",")}.
                {parseFloat(totalAmount.replace(",", ".")) < dataCredit.getB2EUserCredit.creditoDisponible.toFixed(2) ? ` Pagar con crédito` : ` No se puede pagar con crédito: Saldo insuficiente.`}
              </p>
            )}
          </React.Fragment>
        )}
        {!isGuestOrder ? 
          <SC.Next.Wrapper>
            <CallToAction
              filled={true}
              text={t("general.next")}
              action={() => handleNext(history, nextStep)}
            />
          </SC.Next.Wrapper> : 
          <SC.Footer.Wrapper>
            <SC.Footer.Total>
              <em>{t("checkout.ticket.total")}</em>
              <strong>Bs. {totalAmount}</strong>
            </SC.Footer.Total>
            <SC.Footer.Cta>
              {!isProcessing ? 
                <Cta
                  filled
                  text={t("checkout.review.call_to_action")}
                  action={handleGuestConfirm}
                /> : null                
              }
            </SC.Footer.Cta>
          </SC.Footer.Wrapper>
        }
      </SC.Container>
    </Suspense>
  );
};

export default Payment;
