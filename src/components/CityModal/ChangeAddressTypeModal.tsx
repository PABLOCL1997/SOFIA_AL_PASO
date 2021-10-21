import React, { FC, Suspense, useState, useEffect } from "react";
import styled from "styled-components";

import * as SC from "./styles"
import { Changes, ShippingMethod } from "./types";

import DeliveryIcon from "../../assets/images/sap-delivery-icon.svg"
import PickupIcon from "../../assets/images/sap-pickup-icon.svg"
import WarningIcon from "../../assets/images/warning-input.svg"
import { BREAKPOINT } from "../../utils/constants";

const Cta = React.lazy(() => import(/* webpackChunkName: "Cta" */ "../Cta"));

const CtaWrapper = styled.div`
  margin-top: 30px;
  button {
    text-transform: uppercase;
    padding: 15px 50px;
    @media screen and (max-width: ${BREAKPOINT}) {
      span {
        font-size: 14px;
      }
    }
  }

`;

const Title = styled.h3`
  font-size: 24px;
  font-family: MullerMedium;
  line-height: 32px;

  color: var(--black);
  @media screen and (max-width: ${BREAKPOINT}) {
    font-size: 20px;
  }
`

const Instructions = styled.p`
  margin-top: 32px;
  font-size: 16px;
  line-height: 20px;

  @media screen and (max-width: ${BREAKPOINT}) {
    font-size: 12px;
  }
`

const Address = styled.section<{ color: string }>`
  margin-top: 16px;
  display: flex;
  column-gap: 16px;
  justify-content: center;
  align-items: center;
  img {
    width: 18px;
  }
  ${({color}) => `
    h4 {
      color: ${color};
      font-size: 20px;
      font-family: MullerMedium;
      line-height: 20px; 
      text-align: left;
      max-width: 294px;

      @media screen and (max-width: ${BREAKPOINT}) {
        font-size: 16px;
      }
    }
    svg {
      color: ${color};
    }
  `}
`

const Warning = styled.section`
  margin-top: 40px;
  display: flex;
  column-gap: 14px;
    p {
      color: var(--red);
      max-width: 333px;
      text-align: left;
      font-size: 16px;

      @media screen and (max-width: ${BREAKPOINT}) {
        font-size: 12px;
      }
    }
    svg {
      color: var(--red);
    }
`


interface Props {
    text: string;
    visible: boolean;
    stepType: Changes;
    setVisible: Function;
}


const ChangeAddressTypeModal: FC<Props> = ({ text, visible: show, stepType: changeType, setVisible }) => {
    return (
        <Suspense fallback={<></>}>
            <SC.Courtain
                className={show && "visible"}
            >
                <SC.Modal>
                  {changeType === Changes.PickupToPickup &&
                  <>
                    <Title>Cambiaste de dirección</Title>
                    <Instructions>Pasarás a buscar tu pedido por:</Instructions>
                    <Address color="red">
                      <img src={PickupIcon} alt="pickup"/>
                      <h4>{text}</h4>
                    </Address>
                  </>}

                  {changeType === Changes.PickupToDelivery && 
                  <>
                    <Title>Cambiaste de tipo de envío</Title>
                    <Instructions>Tu pedido se enviará a tu domicilio:</Instructions>
                    <Address color="black">
                      {/* <DeliveryIcon /> */}
                      <img src={DeliveryIcon} alt="delivery" />
                      <h4>{text}</h4>
                    </Address>
                    <Warning>
                      <img src={WarningIcon} alt="warning" />
                      <p>Debido al cambio en el tipo de envío, algunos precios y/o cantidades pueden variar.</p>
                    </Warning>
                  </>}

                  {changeType === Changes.DeliveryToPickup &&
                  <>
                    <Title>Cambiaste de tipo de envío</Title>
                    <Instructions>Pasarás a buscar tu pedido por:</Instructions>
                    <Address color="black">
                      <img src={PickupIcon} alt="pickup" />
                      <h4>{text}</h4>
                    </Address>
                    <Warning>
                      <img src={WarningIcon} alt="warning" />
                      <p>Debido al cambio en el tipo de envío, algunos precios y/o cantidades pueden variar.</p>
                    </Warning>

                  </>}

                  {changeType === Changes.DeliveryToDelivery &&
                  <>
                    <Title>Cambiaste de dirección</Title>
                    <Instructions>Tu pedido se enviará a tu domicilio:</Instructions>
                    <Address color="black">
                      <img src={DeliveryIcon} alt="delivery" />
                      <h4>{text}</h4>
                    </Address>
                    <Warning>
                      <img src={WarningIcon} alt="warning" />
                      <p>Debido al cambio en el tipo de envío, algunos precios y/o cantidades pueden variar.</p>
                    </Warning>

                  </>}

                  <CtaWrapper>
                    <Cta
                        filled={true}
                        text={"Continuar"}
                        action={() => setVisible(false)}
                    />
                    </CtaWrapper>

                    <SC.CloseWrapper onClick={() => setVisible(false)}>
                    {/* close */}
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 2L2 16" stroke="#808080" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
                      <path d="M16 16L2 2" stroke="#808080" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
                    </svg>
                  </SC.CloseWrapper>
                    
                </SC.Modal>
            </SC.Courtain>
        </Suspense>
    )

}


export default ChangeAddressTypeModal