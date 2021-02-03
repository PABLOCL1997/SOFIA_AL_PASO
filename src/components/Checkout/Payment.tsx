import React, { FC, Suspense, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { BREAKPOINT } from "../../utils/constants";

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
};

const Payment: FC<Props> = ({ updateOrder }) => {
  const { t } = useTranslation();
  const [option, setOption] = useState("cashondelivery");

  const changeOption = (val: string) => {
    setOption(val);
    updateOrder("payment", { method: val });
  };

  const values = [
    {
      title: t("checkout.payment.cashondelivery"),
      value: "cashondelivery"
    },
    {
      title: t("checkout.payment.checkmo"),
      value: "checkmo"
    } /*,
        {
            title: t('checkout.payment.todotix'),
            value: 'todotix'
        }*/
  ];

  return (
    <Suspense fallback={<Loader />}>
      <Container>
        <Title>{t("checkout.payment.title")}</Title>
        <div className="switchContainer">
          <Switch changeOption={changeOption} option={option} values={values} />
        </div>
        <Disclaimer>{t("checkout.payment.bs_only")}</Disclaimer>
      </Container>
    </Suspense>
  );
};

export default Payment;
