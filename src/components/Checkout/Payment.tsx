import React, { FC, Suspense, useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { BREAKPOINT } from "../../utils/constants";
import { CLIENT_CREDIT } from '../../graphql/b2e/queries';
import { useLazyQuery, useQuery } from 'react-apollo';
import CircleLoader from '../CircleLoader';
import { DETAILS, GET_USER } from "../../graphql/user/queries";


const Loader = React.lazy(
  () => import(/* webpackChunkName: "Loader" */ "../Loader")
);
const Switch = React.lazy(
  () => import(/* webpackChunkName: "Switch" */ "../Switch")
);

const Container = styled.div`
  @media screen and (max-width: ${BREAKPOINT}) {
    .switchContainer > div {
      > div {
        font-size: 10px;
      }
    }
  }
`;

const Title = styled.h2`
  font-family: MullerMedium;
  font-size: 16px;
  line-height: 16px;
  color: var(--red);
  margin-bottom: 30px;
`;

const Disclaimer = styled.div`
  font-family: MullerMedium;
  font-size: 12px;
  line-height: 12px;
  letter-spacing: 0.01em;
  color: var(--black);
  margin-top: 20px;
`;

type Props = {
  updateOrder: Function;
  userData: any;
  userDetails: any;
  totalAmount: any;
  setOrderIsReady: Function;
}
const red = {
  color: "red"
} as React.CSSProperties
const green = {
  color: "green"
} as React.CSSProperties

const Payment: FC<Props> = ({ updateOrder, userData, userDetails, totalAmount, setOrderIsReady }) => {
  const { t } = useTranslation();
  const CREDIT = 'ccsave'
  
  const valuesB2E = [
    { title: 'credito', value: CREDIT }    
  ];
  const values = [
    {
      title: t("checkout.payment.cashondelivery"),
      value: "cashondelivery"
    },
    {
      title: t("checkout.payment.checkmo"),
      value: "checkmo"
    },
    // {
    //   title: t('checkout.payment.todotix'),
    //   value: 'todotix'
    // }
  ]

  const [option, setOption] = useState('cashondelivery');
  const [options, setOptions] = useState(values)
  

  const [userCredit, { loading: loadingCredit, data: dataCredit }] = useLazyQuery(CLIENT_CREDIT, {
    fetchPolicy: "network-only",
    onCompleted: d => {
      setOrderIsReady(true)
      // actualizar valor para que el cliente sepa si le alcanza.
      if (option === CREDIT) {
        parseFloat(totalAmount.replace(',', '.')) < d.getB2EUserCredit.creditoDisponible.toFixed(2)
          ? setOrderIsReady(true)
          : setOrderIsReady(false)
      }
    }
  })

  const changeOption = (val: string) => {
    if (val === CREDIT) {
      setOrderIsReady(false)
      userCredit({
        variables: {
          idAddress: 0,
          idClient: parseInt(userDetails?.details?.employee) || 0
        }
      })
    } else {
      setOrderIsReady(true)
    }
    setOption(val);
    updateOrder('payment', { method: val });
  }

  useEffect(() => {
    if(userData.userInfo[0].idPriceList && userData.userInfo[0].idPriceList > 0) {
      changeOption(CREDIT)
      setOptions(valuesB2E)
      updateOrder('payment', { method: CREDIT });
    }else {
      setOptions(values)
      setOption(values[0].value)
      updateOrder('payment', { method: values[0].value });
    }

  }, [userData])

  return (
    <Suspense fallback={<Loader />}>
      <Container>
        <Title>{t("checkout.payment.title")}</Title>
        <div className="switchContainer">
          <Switch changeOption={changeOption} option={option} values={options} />
        </div>
        <Disclaimer>{t("checkout.payment.bs_only")}</Disclaimer>
        {option === CREDIT && (
          <React.Fragment>
            {loadingCredit && (
              <CircleLoader noHeight={true} />
            )}
            {!loadingCredit && dataCredit && (
              <p style={parseFloat(totalAmount.replace(',', '.')) < dataCredit.getB2EUserCredit.creditoDisponible.toFixed(2) ? green : red}>
                Crédito Bs. {String(dataCredit.getB2EUserCredit.creditoDisponible.toFixed(2)).replace('.', ',')}.
                {parseFloat(totalAmount.replace(',', '.')) < dataCredit.getB2EUserCredit.creditoDisponible.toFixed(2) ? ` Pagar con crédito` : ` No se puede pagar con crédito: Saldo insuficiente.`}
              </p>
            )}
          </React.Fragment>
        )}
      </Container>
    </Suspense>
  );
};

export default Payment;
