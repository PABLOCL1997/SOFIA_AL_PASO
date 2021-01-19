import React, { Suspense, FC, useEffect } from "react";
import styled from "styled-components";
import { BREAKPOINT } from "../utils/constants";
import { TERMS_TITLE } from "../meta";
import DelayedWrapper from "../components/DelayedWrapper";
import { useTranslation } from "react-i18next";

const Loader = React.lazy(() =>
  import(/* webpackChunkName: "Loader" */ "../components/Loader")
);

const Header = styled.div`
  position: relative;
  padding: 84px 0;
  text-align: center;
  box-shadow: 0px -1px 52px rgba(0, 0, 0, 0.08);

  h2 {
    font-family: MullerMedium;
    font-size: 40px;
    line-height: 1.5em;
    color: var(--black);
  }

  &:after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: -4px;
    margin-left: -40px;
    width: 80px;
    height: 8px;
    border-radius: 15px;
    background: var(--red);
  }

  @media screen and (max-width: ${BREAKPOINT}) {
    padding: 40px 20px;
  }
`;

const Accordion = styled.div`
  max-width: 688px;
  padding: 20px;
  margin: 50px auto;
`;

const Question = styled.div`
  padding: 32px 0;
  border-bottom: 2px solid rgba(0, 0, 0, 0.11);
  &:last-child {
    border-bottom: 0;
  }
  h2 {
    font-family: MullerMedium;
    font-size: 24px;
    line-height: 1.5em;
    letter-spacing: 0.01em;
    color: var(--black);
    margin-bottom: 16px;
    cursor: pointer;
  }
  p {
    font-size: 14px;
    line-height: 1.5em;
    letter-spacing: 0.01em;
    color: var(--black);
    display: block;
  }
`;

type Question = {
  title: string;
  text: string;
};

type Props = {};
const Terms: FC<Props> = () => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = TERMS_TITLE;
  }, []);

  return (
    <Suspense fallback={<Loader />}>
      <DelayedWrapper>
        <Header>
          <div className="main-container">
            <h2>{t("footer.terms")}</h2>
          </div>
        </Header>
        <div className="main-container">
          <Accordion>
            <Question>
              <p>
                Confirmaremos su reserva inmediatamente utilizando la dirección
                de correo electrónico que proporcionó al realizar la reserva y
                procederemos a retener el cobro de su tarjeta. Al momento de
                realizar su compra de productos y pago del importe generado por
                la compra de los productos, podría existir diferencias en los
                productos cárnicos con relación al peso y precio, según tamaño,
                peso, corte de carnes y precio del día de los productos, en este
                caso al momento de facturar la compra de los productos se
                refleja el monto exacto y en caso de existir saldos entre el
                monto retenido y el monto de la factura, se procederá con la
                devolución de la diferencia a través del mismo medio de pago con
                el que se realizó la reserva y compra de los productos, Los
                tiempos de ejecución de la devolución del excedente sobre el
                monto retenido dependen absolutamente de la entidad financiera
                que emite la tarjeta utilizada, en ningún caso Sofia LTDA tendrá
                injerencia sobre dichos tiempos, quedando liberada de toda
                responsabilidad sobre eventuales retrasos en la liberación del
                dinero.
              </p>
            </Question>
          </Accordion>
        </div>
      </DelayedWrapper>
    </Suspense>
  );
};

export default Terms;
