import React, { Suspense, FC, useEffect } from "react";
import { useMutation } from "@apollo/react-hooks";
import { SET_USER } from "../graphql/user/mutations";
import { RETIRO_TITLE } from "../meta";

import { Wrapper, Header, StepsWrap, Step, NumberIcon, Image, TextContainer, Text, SubText, RetireAlPasoDiv, Columns, StepMobileWrap, MobileStep } from "../styled-components/RetiroAlPasoStyle";
import { ReactComponent as SucursalIcon } from "../assets/retiro-al-paso-images/sucursal-icon.svg";
import Image1 from "../assets/retiro-al-paso-images/imagen-1.png";
import Image2 from "../assets/retiro-al-paso-images/imagen-2.png";
import Image3 from "../assets/retiro-al-paso-images/imagen-3.png";
import Image4 from "../assets/retiro-al-paso-images/imagen-4.png";
import Image5 from "../assets/retiro-al-paso-images/imagen-5.png";

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../components/Loader"));

const Cta = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../components/Cta"));

type Props = {};

const RetiroAlPaso: FC<Props> = () => {
  const [toggleCityModal] = useMutation(SET_USER, {
    variables: { user: { openCityModal: true } },
  });

  const [closeCityModal] = useMutation(SET_USER, {
    variables: { user: { openCityModal: false } },
  });

  useEffect(() => {
    closeCityModal();
    document.title = RETIRO_TITLE;
  }, []);

  return (
    <Suspense fallback={<Loader />}>
      <Wrapper>
        <Header>
          <div>
            <SucursalIcon />
            <h1>Retiro al paso</h1>
          </div>
        </Header>
        <StepsWrap>
          <Step>
            <Columns align={"right"}>
              <TextContainer align={"right"}>
                <Text>Elige la opción de Retira al paso</Text>
                <SubText>¡Retira en Sofía al Paso dentro de la siguiente hora! Guardamos tu pedido hasta 24 horas.</SubText>
              </TextContainer>
            </Columns>
            <NumberIcon>
              <span>1</span>
            </NumberIcon>
            <Columns align={"left"}>
              <Image src={Image1} alt="[Retira al paso - Recibe en casa]" maxWidth={"236px"} />
            </Columns>
          </Step>
          <Step>
            <Columns align={"right"}>
              <Image src={Image2} alt="[Mapa y dirección]" maxWidth={"385px"} />
            </Columns>
            <NumberIcon>
              <span>2</span>
            </NumberIcon>
            <Columns align={"left"}>
              <TextContainer align={"left"}>
                <Text maxWidth={"315px"}>Elige la sucursal de Sofía al Paso de tu preferencia</Text>
                <SubText>Encuentra la sucursal en el mapa y haz clic para seleccionarla.</SubText>
              </TextContainer>
            </Columns>
          </Step>
          <Step className="step-3">
            <Columns align={"right"}>
              <TextContainer align={"right"}>
                <Text>Escoge tus productos favoritos</Text>
                <SubText>Agrega al carrito los productos que deseas comprar y cuando estés listo avanza al Checkout.</SubText>
              </TextContainer>
            </Columns>
            <NumberIcon>
              <span>3</span>
            </NumberIcon>
            <Columns align={"left"}>
              <Image src={Image3} alt="[Agregar más]" maxWidth={"220px"} className="img-3" />
            </Columns>
          </Step>{" "}
          <Step className="step-4">
            <Columns align={"right"}>
              <Image src={Image4} alt="[Enviar pedido]" maxWidth={"385px"} className="img-4" />
            </Columns>
            <NumberIcon>
              <span>4</span>
            </NumberIcon>
            <Columns align={"left"}>
              <TextContainer align={"left"}>
                <Text maxWidth={"315px"}>Finaliza tu pedido</Text>
                <SubText>Revisa tus datos personales y haz clic en Enviar pedido para finalizar tu compra.</SubText>
              </TextContainer>
            </Columns>
          </Step>
          <Step className="step-5">
            <Columns align={"right"}>
              <TextContainer align={"right"}>
                <Text>Espera el email de confirmación</Text>
                <SubText>
                  Recibirás en los próximos minutos un email confirmando tu pedido y cuando tu pedido esté listo para retirar recibirás otro email para que pases por la sucursal de Sofía al Paso
                  seleccionada.
                </SubText>
              </TextContainer>
            </Columns>
            <NumberIcon>
              <span>5</span>
            </NumberIcon>
            <Columns align={"left"}>
              <Image src={Image5} alt="[Pedido realizado]" maxWidth={"160px"} className="img-5" />
            </Columns>
          </Step>
          <RetireAlPasoDiv>
            <Cta
              filled={true}
              action={() => {
                toggleCityModal();
                // @ts-ignore
                document.querySelector(".storePickup").click();
              }}
              text={"¡Retira al paso!"}
            />
          </RetireAlPasoDiv>
        </StepsWrap>
        <StepMobileWrap>
          <MobileStep>
            <NumberIcon>
              <span>1</span>
            </NumberIcon>
            <TextContainer>
              <Text>Elige la opción de Retira al paso</Text>
              <SubText marginTop={"0px"}>¡Retira en Sofía al Paso dentro de la siguiente hora! Guardamos tu pedido hasta 24 horas.</SubText>
            </TextContainer>
            <Image src={Image1} alt="[Retira al paso - Recibe en casa]" maxWidth={"236px"} />
          </MobileStep>
          <MobileStep>
            <NumberIcon>
              <span>2</span>
            </NumberIcon>
            <TextContainer>
              <Text maxWidth={"230px"}> Elige la sucursal de Sofía al Paso de tu preferencia</Text>
              <SubText marginTop={"0px"}>Encuentra la sucursal en el mapa y haz clic para seleccionarla.</SubText>
            </TextContainer>
            <Image src={Image2} alt="[Mapa y dirección]" maxWidth={"320px"} />
          </MobileStep>
          <MobileStep>
            <NumberIcon>
              <span>3</span>
            </NumberIcon>
            <TextContainer>
              <Text maxWidth={"250px"}> Escoge tus productos favoritos</Text>
              <SubText marginTop={"0px"}>Agrega al carrito los productos que deseas comprar y cuando estés listo avanza al Checkout.</SubText>
            </TextContainer>
            <Image src={Image3} alt="[Agregar más]" maxWidth={"220px"} />
          </MobileStep>

          <MobileStep>
            <NumberIcon>
              <span>4</span>
            </NumberIcon>
            <TextContainer>
              <Text maxWidth={"200px"}> Finaliza tu pedido</Text>
              <SubText marginTop={"0px"}>Revisa tus datos personales y haz clic en Enviar pedido para finalizar tu compra.</SubText>
            </TextContainer>
            <Image src={Image4} alt="[Enviar pedido]" maxWidth={"385px"} />
          </MobileStep>
          <MobileStep>
            <NumberIcon>
              <span>5</span>
            </NumberIcon>
            <TextContainer>
              <Text maxWidth={"250px"}>Espera el email de confirmación</Text>
              <SubText marginTop={"0px"}>
                Recibirás en los próximos minutos un email confirmando tu pedido y cuando tu pedido esté listo para retirar recibirás otro email para que pases por la sucursal de Sofía al Paso
                seleccionada.
              </SubText>
            </TextContainer>
            <Image src={Image5} alt="[Pedido realizado]" maxWidth={"160px"} />
          </MobileStep>
          <RetireAlPasoDiv>
            <Cta filled={true} action={() => toggleCityModal()} text={"¡Retira al paso!"} />
          </RetireAlPasoDiv>
        </StepMobileWrap>
      </Wrapper>
    </Suspense>
  );
};

export default RetiroAlPaso;
