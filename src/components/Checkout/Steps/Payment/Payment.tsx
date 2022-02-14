import React, { FC, Suspense, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CLIENT_CREDIT } from "../../../../graphql/b2e/queries";
import { useLazyQuery } from "react-apollo";
import CircleLoader from "../../../CircleLoader";
import * as SC from "./style";
import { useHistory } from "react-router-dom";
import { handleNext } from "../../../../types/Checkout";
import useCityPriceList from "../../../../hooks/useCityPriceList";
import arrow from "../../../../assets/images/arrow-back-checkout.svg";

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../../../Loader"));
const Switch = React.lazy(() => import(/* webpackChunkName: "Switch" */ "../../../Switch"));
const CallToAction = React.lazy(() => import(/* webpackChunkName: "CallToAction" */ "../../../Cta"));

const nextStep = "review";
const previousStep = "shipping";

const Payment: FC<{
  updateOrder: (field: string, value: { method: string }) => void;
  userDetails: any;
  totalAmount: any;
  setOrderIsReady: Function;
  orderData: any
}> = ({
  updateOrder,
  userDetails,
  totalAmount,
  setOrderIsReady,
  orderData
}) => {
  const { t } = useTranslation();
  const history = useHistory();

  const CREDIT = {
    title: "credito",
    value: "ccsave",
  };
  const POS = {
    // Con tarjeta en domicilio
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
  const { idPriceList, agency } = useCityPriceList();
  const valuesB2E = [CASH, POS, TODOTIX, CREDIT];

  const values = [CASH, POS, TODOTIX];
  const valuesPickup = [CASH, POS];

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

  const option = useMemo(() => {
    return orderData?.payment?.method;
  }, [orderData]);

  const options = useMemo(() => {
    if (idPriceList) { 
      updateOrder("payment", { method: CREDIT.value });
      return valuesB2E;
    }
    if (agency) {
      updateOrder("payment", { method: valuesPickup[0].value });
      return valuesPickup;
    }
    updateOrder("payment", { method: values[0].value });
    return values;
  }, [idPriceList, agency]);

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
        <SC.Next.Wrapper>
          <CallToAction
            filled={true}
            text={t("general.next")}
            action={() => handleNext(history, nextStep)}
          />
        </SC.Next.Wrapper>
      </SC.Container>
    </Suspense>
  );
};

export default Payment;
