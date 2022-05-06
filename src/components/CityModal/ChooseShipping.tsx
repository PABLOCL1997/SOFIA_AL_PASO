import React, { FC, Suspense, useState, useEffect, useMemo } from "react";
import { ShippingMethod, Steps } from "./types";
import styled from "styled-components";
import { BREAKPOINT } from "../../utils/constants";
import { Trans, useTranslation, UseTranslationOptions } from "react-i18next";
import PickupIcon from "../../assets/images/ChooseShipping/pickup-icon";
import DeliveryIcon from "../../assets/images/ChooseShipping/delivery-icon";
import ExpressIcon from "../../assets/images/ChooseShipping/express-icon";
import useUser from "../../hooks/useUser";
import useCityPriceList from "../../hooks/useCityPriceList";
import { OrderType } from "../../types/Order";
import dayjs from "dayjs";
const es = require("dayjs/locale/es");
const utc = require("dayjs/plugin/utc"); // dependent on utc plugin
const timezone = require("dayjs/plugin/timezone");
const isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
const isSameOrBefore = require("dayjs/plugin/isSameOrBefore");

dayjs.locale(es);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const Wrapper = styled.section`
  @media screen and (max-width: ${BREAKPOINT}) {
    width: 100%;
    padding: 10px 15px;
  }
`;

const Title = styled.h3`
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
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
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
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
const Options = styled.ul<{ showExpress: boolean }>`
  display: grid;
  ${({ showExpress }) =>
    showExpress
      ? `
    grid-template-columns: 1fr 1fr 1fr;
  `
      : `
    grid-template-columns: 1fr 1fr;
  `}
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
    position: relative;
    
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
        margin-top: 24px;

        font-family: 'Montserrat', sans-serif;
        font-weight: 500;
        font-style: normal;
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

    strong {
      position: absolute;
      top: 10px;
      right: 10px;
      border-radius: 10px;
      font-size: 10px;
      padding: 2px 5px;
      background-color: var(--red);
      color: var(--white);

      cursor: pointer;
      z-index: 2;
    }

    @media screen and (max-width: ${BREAKPOINT}) {
        padding: 20px 8px;
    }
`;

const Strong = styled.strong`
  margin-top: 16px;
  max-width: 203px;
  strong {
    font-family: 'Montserrat', sans-serif;
    font-weight: bold;
  }
  // timeframes
  em {
    display: block;
    font-size: 14px;
    font-family: 'Montserrat', sans-serif;
    font-weight: 500;
    margin: 8px 0 10px;
  }
  // cities available
  small {
    display: block;
    font-family: 'Montserrat', sans-serif;
    font-weight: bold;
    margin-top: 8px;
  }

  @media screen and (max-width: ${BREAKPOINT}) {
    font-size: 12px;
  }
`;

const ChooseShipping: FC<{
  setStep: Function;
  setShippingMethod: Function;
  street: string;
}> = ({ setStep, setShippingMethod, street }) => {
  const { t } = useTranslation("", { keyPrefix: "citymodal" } as UseTranslationOptions);
  const handleStep = (step: ShippingMethod) => {
    setShippingMethod(step);
    setStep(Steps.Detailing);
  };
  const { store } = useUser();
  const { city }: { city: string } = useCityPriceList();
  const showExpress = useMemo(() => {
    const initHour: dayjs.Dayjs = dayjs().tz("America/La_Paz").hour(8).minute(0).second(0);
    const finishHour: dayjs.Dayjs = dayjs().tz("America/La_Paz").hour(19).minute(0).second(0);
    const date: dayjs.Dayjs = dayjs().tz("America/La_Paz");

    // @ts-ignore
    return (city === "SC" || city === "CB" || city === "LP") && date.isSameOrAfter(initHour, "second") && date.isSameOrBefore(finishHour, "second");
  }, [city]);

  return (
    <Wrapper>
      <Title>{t("welcome")}</Title>
      <Subtitle>{t("subtitle")}</Subtitle>
      <Options showExpress={showExpress}>
        <Option className="storePickup" selected={store === "PICKUP"} onClick={() => handleStep(ShippingMethod.Pickup)}>
          <PickupIcon />
          <p>{t("pickup_title")}</p>
          {/* show only if selected */}
          {store === "PICKUP" && <em>{street}</em>}
        </Option>
        {/* show this option only in Santa Cruz */}
        {showExpress ? (
          <Option selected={store === "EXPRESS"} className="storeExpress" onClick={() => handleStep(ShippingMethod.Express)}>
            <ExpressIcon />
            <p onClick={() => handleStep(ShippingMethod.Express)}>{t("express_title")}</p>
            <strong onClick={() => handleStep(ShippingMethod.Store)}>{t("new_brand")}</strong>
          </Option>
        ) : null}
        <Option className="delivery" selected={store === "B2E" || store === "ECOMMERCE"} onClick={() => handleStep(ShippingMethod.Delivery)}>
          <DeliveryIcon />
          <p>{t("delivery_title")}</p>
          {/* show only if selected */}
          {(store === "B2E" || store === "ECOMMERCE") && <em>{street}</em>}
        </Option>
        <Strong>{t("pickup_description")}</Strong>
        {/* show this description only in Santa Cruz */}
        {showExpress ? (
          <Strong>
            <Trans i18nKey={t("express_description")} components={{ strong: <strong />, cities: <small />, timeframes: <em /> }} />
          </Strong>
        ) : null}
        <Strong>
          <Trans i18nKey={t("delivery_description")} components={{ strong: <strong /> }} />
        </Strong>
      </Options>
    </Wrapper>
  );
};

export default ChooseShipping;
