import React, { FC, Suspense, useState, useEffect } from "react";
import { ShippingMethod, Steps } from "./types";
import styled from "styled-components";
import { BREAKPOINT } from "../../utils/constants";

const Wrapper = styled.section`
  @media screen and (max-width: ${BREAKPOINT}) {
    width: 100%;
    padding: 10px 15px;
  }
`;

const Title = styled.h3`
  font-family: MullerMedium;
  font-style: normal;
  font-size: 24px;
  line-height: 32px;
  /* identical to box height, or 133% */

  text-align: center;

  /* Negro Sofía */

  color: var(--black);
  @media screen and (max-width: ${BREAKPOINT}) {
    font-size: 18px;
  }
`;
const Subtitle = styled.h4`
  margin-top: 16px;
  font-family: MullerMedium;
  font-style: normal;
  font-size: 20px;
  line-height: 28px;
  /* identical to box height, or 140% */

  text-align: center;

  /* Negro Sofía */

  color: var(--black);
  @media screen and (max-width: ${BREAKPOINT}) {
    font-size: 16px;
  }
`;
const Options = styled.ul`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 24px;

  margin-top: 56px;
  @media screen and (max-width: ${BREAKPOINT}) {
    margin-top: 36px;
    column-gap: 15px;
  }
`;
const Option = styled.li<{ selected: boolean }>`
    padding: 41px;
    
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    
    cursor:pointer;
    ${({ selected }) =>
      selected
        ? `
        background-color: rgba(254, 205, 0, 0.6);
        `
        : `
        margin-bottom: 7px;
        background-color: rgba(240, 240, 240, 0.6);
        `}
    
    border-radius: 16px;

    p {
        margin-top 24px;

        font-family: MullerMedium;
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        line-height: 20px;
        
        color: #000000;

        @media screen and (max-width: ${BREAKPOINT}) {
            font-size: 14px;   
        }
    }
    
    em {
        font-size: 12px;
        color: #000000;
        
        max-width: 140px;
        
        
        @media screen and (max-width: ${BREAKPOINT}) {
            font-size: 10px;   
        }
    }

    @media screen and (max-width: ${BREAKPOINT}) {
        padding: 20px 8px;
    }
`;

const Strong = styled.strong`
  margin-top: 16px;
  max-width: 203px;
  span {
    font-family: MullerBold;
  }

  @media screen and (max-width: ${BREAKPOINT}) {
    font-size: 12px;
  }
`;

interface Props {
  setStep: Function;
  setShippingMethod: Function;
  isAgency: boolean;
  street: string;
}

const ChooseShipping: FC<Props> = ({ setStep, setShippingMethod, isAgency, street }) => {
  const handleStepPickup = () => {
    setShippingMethod(ShippingMethod.Pickup);
    setStep(Steps.Detailing);
  };
  const handleStepDelivery = () => {
    setShippingMethod(ShippingMethod.Delivery);
    setStep(Steps.Detailing);
  };

  return (
    <Wrapper>
      <Title>¡Bienvenido a Sofía!</Title>
      <Subtitle>¿A dónde enviamos tu pedido?</Subtitle>
      <Options>
        <Option className="storePickup" selected={isAgency} onClick={handleStepPickup}>
          {/* icono de sucursal */}
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0)">
              <path
                d="M32.5 1.25H7.5L1.25 12.5C1.25 15.9525 4.0475 18.75 7.5 18.75C10.9525 18.75 13.75 15.9525 13.75 12.5C13.75 15.9525 16.5475 18.75 20 18.75C23.4525 18.75 26.25 15.9525 26.25 12.5C26.25 15.9525 29.0475 18.75 32.5 18.75C35.9525 18.75 38.75 15.9525 38.75 12.5L32.5 1.25Z"
                stroke="#E30613"
                strokeWidth="2.6"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M33.75 23.75V38.75H6.25V23.75" stroke="#E30613" strokeWidth="2.6" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16.25 38.75V28.75H23.75V38.75" stroke="#E30613" strokeWidth="2.6" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <defs>
              <clipPath id="clip0">
                <rect width="40" height="40" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <p>Retira al paso</p>
          {/* show only if selected */}
          {isAgency && <em>{street}</em>}
        </Option>
        <Option className="delivery" selected={!isAgency} onClick={handleStepDelivery}>
          {/* icono de casa */}
          <svg width="36" height="38" viewBox="0 0 36 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.1905 2L2 14.9524V36H13.3333V24.6667H23.0476V36H34.381V14.9524L18.1905 2Z" stroke="#E30613" strokeWidth="2.6" strokeMiterlimit="10" strokeLinecap="square" />
          </svg>
          <p>Recibe en casa</p>
          {/* show only if selected */}
          {!isAgency && <em>{street}</em>}
        </Option>
        <Strong>¡Retira en Sofía al Paso dentro de la siguiente hora! Guardamos tu pedido hasta 24 horas.</Strong>
        <Strong>
          Realiza tu pedido hasta las <span>17:00</span> y recibe a domicilio el siguiente día (entregas de lunes a sábado)
        </Strong>
      </Options>
    </Wrapper>
  );
};

export default ChooseShipping;
