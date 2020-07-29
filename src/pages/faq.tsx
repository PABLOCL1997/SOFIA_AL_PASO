import React, { Suspense, FC, useEffect, useState } from "react";
import styled from "styled-components";
import { BREAKPOINT } from "../utils/constants";
import { FAQ_TITLE } from "../meta";
import DelayedWrapper from "../components/DelayedWrapper";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-apollo";
import { GET_USER } from "../graphql/user/queries";
import { GET_MIN_PRICE } from "../graphql/cart/queries";

const Loader = React.lazy(() =>
  import(/* webpackChunkName: "Loader" */ "../components/Loader")
);

const Header = styled.div`
  position: relative;
  padding: 84px 0;
  text-align: center;
  box-shadow: 0px -1px 52px rgba(0, 0, 0, 0.08);

  h1 {
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

const Question = styled.div<{ active: boolean }>`
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
    display: ${props => (props.active ? "block" : "none")};
  }
`;

const Footer = styled.div`
  background: var(--red);
  padding: 90px 20px;
  h2 {
    font-family: MullerMedium;
    font-style: normal;
    font-weight: 500;
    font-size: 32px;
    line-height: 32px;
    color: #ffffff;
    text-align: center;
  }
  p {
    font-family: MullerMedium;
    font-size: 16px;
    line-height: 16px;
    text-align: center;
    letter-spacing: 0.01em;
    color: #ffffff;
    margin-top: 32px;
    a {
      font-family: MullerBold;
      font-size: 16px;
      line-height: 16px;
      letter-spacing: 0.01em;
      color: #ffffff;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

type Question = {
  title: string;
  text: string;
};

type Props = {};
const Faq: FC<Props> = () => {
  const { t } = useTranslation();

  const [question, setQuestion] = useState(0);
  const { data: userData } = useQuery(GET_USER, {});

  const questions: Array<Question> = [
    {
      title: `¿Hay un costo mínimo para realizar una compra online?`,
      text: `Existe hasta el momento un monto mínimo de Bs ${GET_MIN_PRICE(
        userData
      )}.-`
    },
    {
      title: `¿Cuánto demora la entrega de los pedidos?`,
      text: `Se entrega dentro de las 48 horas hábiles de lunes a viernes.`
    },
    {
      title: `¿Cómo sé que mi pedido está registrado?`,
      text: `Al finalizar tu orden recibirás un correo electrónico con un número de pedido, lo que significa que la orden está registrada.`
    },
    {
      title: `¿Qué ocurre si hay un problema con mi orden, si demora, o no recibí confirmación?`,
      text: `Puedes  comunicarte al 784 45000 o escribirnos a info@sofia.com.bo`
    },
    {
      title: `¿Cómo puedo cancelar una orden?`,
      text: `Para cancelar una orden puedes comunicarte al 784 45000 o escribirnos a info@sofia.com.bo, o enviarnos un inbox a nuestro Facebook.`
    },
    {
      title: `¿Cómo puedo modificar una orden?`,
      text: `Para modificar una orden puedes comunicarte al  784 45000 o escribirnos a info@sofia.com.bo, o enviarnos un inbox a nuestro Facebook.`
    },
    {
      title: `¿Por qué se canceló mi orden?`,
      text: `Tu orden se pudo haber cancelado excepcionalmente por falta de stock de los productos que elegiste, de todos modos nos comunicaríamos contigo, primero para corroborar que estás de acuerdo o remplazar por otros productos. También tu orden puede cancelarse porque  la zona que registraste no está dentro de nuestro rango de entrega.`
    },
    {
      title: `¿Cómo realizo el seguimiento de mi pedido?`,
      text: `Puedes comunicarte al  784 45000 o escribirnos a info@sofia.com.bo, o enviarnos un inbox a nuestro Facebook.`
    },
    {
      title: `¿Cómo puedo devolver un producto?`,
      text: `Para devolver un producto puedes comunicarte al  78445000 o enviarnos un inbox a nuestro Facebook, pero para esto debe haber una razón que amerite la devolución o el cambio del producto. Nuestro personal de control de calidad se contactará contigo y debes preservar el producto con la cadena de frío adecuada.`
    },
    {
      title: `¿Está mi domicilio  dentro del radio de entregas de pedidos?`,
      text: `Prueba  ingresando tu dirección en el mapa, si te permite marcar tu casa es porque sí llegamos hasta esa zona. Nuestro sistema de chequeo corroborará de todos modos si tu domicilio entra en la zona de distribución a hogar.`
    },
    {
      title: `¿Qué hago si me enviaron producto con fecha corta de vencimiento?`,
      text: `Los productos se entregan con fechas que se pueden consumir y por políticas de la empresa se pueden entregar todavía. Si tienes alguna consulta o reclamo no dudes en comunicarte con nosotros.`
    },
    {
      title: `¿Cómo realizo un pedido para mi tienda o por mayor?`,
      text: `Si tienes Código de Cliente: Puedes hacer tu pedido al 784 45000 o con el preventista de tu zona. Para la apertura de código puedes comunicarte a nuestro Whatsapp business y seguir los pasos que te indica o Puedes escribirnos un inbox indicando tu nombre, celular, ciudad y zona de tu tienda para comunicarte con un ejecutivo de ventas.`
    }
  ];

  useEffect(() => {
    document.title = FAQ_TITLE;
  }, []);

  return (
    <Suspense fallback={<Loader />}>
      <DelayedWrapper>
        <Header>
          <div className="main-container">
            <h1>{t("faq.title")}</h1>
          </div>
        </Header>
        <div className="main-container">
          <Accordion>
            {questions.map((q: Question, index: number) => (
              <Question active={question === index} key={index}>
                <h2 onClick={() => setQuestion(index)}>{q.title}</h2>
                <p>{q.text}</p>
              </Question>
            ))}
          </Accordion>
        </div>
        <Footer>
          <div className="main-container">
            <h2>{t("faq.footer.title")}</h2>
            <p
              dangerouslySetInnerHTML={{ __html: t("faq.footer.contact") }}
            ></p>
          </div>
        </Footer>
      </DelayedWrapper>
    </Suspense>
  );
};

export default Faq;
