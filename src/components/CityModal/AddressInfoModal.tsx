import React, { FC, Suspense, useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styled from "styled-components";
import useUser from "../../hooks/useUser";
import { BREAKPOINT } from "../../utils/constants";
import { ShippingOptions } from "../Checkout/Steps/Shipping/types";

import * as SC from "./styles";
import * as Icons from "../../assets/employee/Icons";

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

const Anchor = styled.a`
  color: var(--red);
  text-decoration: underline;
  font-size: 14px;
`;

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;

  svg {
    margin-bottom: 4px;
  }
  h3 {
    font-family: 'Montserrat', sans-serif;
    font-weight: 500;
    margin-bottom: 24px;
    font-size: 24px;
  }
  small {
    margin-bottom: 8px;
    font-size: 16px;
  }
  strong {
    font-family: 'Montserrat', sans-serif;
    font-weight: 500;
    color: var(--red);
    margin-bottom: 16px;
    font-size: 20px;
    max-width: 300px;
  }
  a {
    margin-bottom: 32px;
  }
  p {
    margin-bottom: 45px;
    font-size: 16px;
    max-width: 389px;
  }
`;

const mapAdrressType = (type: string): ShippingOptions => {
  // https://stackoverflow.com/questions/36316326/typescript-ts7015-error-when-accessing-an-enum-using-a-string-type-parameter
  return type ? ShippingOptions[type as keyof typeof ShippingOptions] : ShippingOptions.Delivery;
};

const AddressInfoModal: FC<{
  isVisible: boolean;
}> = ({ isVisible }) => {
  const { t } = useTranslation();
  const { hideAddressInfo, user } = useUser();

  const street = useMemo(() => user.userInfo[0].addressInfo, [user]);
  const shippingMethod = useMemo(() => mapAdrressType(user.userInfo[0].addressType), [user]);

  return (
    <Suspense fallback={<></>}>
      <SC.Courtain className={isVisible && "visible"}>
        <SC.Modal>
          {shippingMethod === ShippingOptions.Employee && (
            <Wrapper>
              <Icons.Employee />
              <h3>Recibe como empleado</h3>
              <small>Tu dirección</small>
              <strong>{street}</strong>
              <Anchor>
                <Link to="/mi-cuenta">{t("header.employee.edit")}</Link>{" "}
              </Anchor>
              <p>Enviando tus productos a esta dirección, recibirás descuentos y promociones por ser empleado.</p>
              <CtaWrapper>
                <Cta
                  filled={true}
                  text={"Continuar"}
                  action={() => {
                    hideAddressInfo();
                  }}
                />
              </CtaWrapper>
            </Wrapper>
          )}

          {shippingMethod === ShippingOptions.Delivery && (
            <Wrapper>
              <Icons.Delivery />
              <h3>Recibe en casa</h3>
              <small>Tu dirección</small>
              <strong>{street}</strong>
              <Anchor>
                <Link to="/mi-cuenta">{t("header.employee.edit")}</Link>{" "}
              </Anchor>
              <CtaWrapper>
                <Cta
                  filled={true}
                  text={"Continuar"}
                  action={() => {
                    hideAddressInfo();
                  }}
                />
              </CtaWrapper>
            </Wrapper>
          )}

          {shippingMethod === ShippingOptions.Pickup && (
            <Wrapper>
              <Icons.Pickup />
              <h3>Retira al paso</h3>
              <small>Dirección de retiro</small>
              <strong>{street}</strong>
              <CtaWrapper>
                <Cta
                  filled={true}
                  text={"Continuar"}
                  action={() => {
                    hideAddressInfo();
                  }}
                />
              </CtaWrapper>
            </Wrapper>
          )}

          <SC.CloseWrapper
            onClick={() => {
              hideAddressInfo();
            }}
          >
            {/* close */}
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2L2 16" stroke="#808080" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
              <path d="M16 16L2 2" stroke="#808080" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
            </svg>
          </SC.CloseWrapper>
        </SC.Modal>
      </SC.Courtain>
    </Suspense>
  );
};

export default AddressInfoModal;
