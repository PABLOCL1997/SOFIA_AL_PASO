import React, { Suspense, FC, useEffect, useState } from "react";
import { useTranslation, Trans, UseTranslationOptions } from "react-i18next";

import * as SC from "./style";
import * as GSC from "../style";
import { ActivateProps } from "../props";

interface Props {
  name: string;
  phone: string;
  onNextSMS: Function
}

const ValidateOptions: FC<ActivateProps & Props> = ({ onBack, onNext, error, name, phone, onNextSMS}) => {
  const { t } = useTranslation("", { keyPrefix: "activate.steps.validate_options" } as UseTranslationOptions); 
  const [clientValue, setClientValue] = useState("");

  const mutePhone = (phone: string) => {
    return phone.length > 6 ? phone.substr(0, 3) + "****" + phone.substr(phone.length - 3) : phone;
  };

  const handleChange = (event: { target: { value: string } }) => {
    const value = event.target.value;
    if (!isNaN(Number(value)) && value.length <= 10) {
      setClientValue(value);
    }
  }  

  return (
    <GSC.Wrapper>
      <GSC.Title>{t("title")}</GSC.Title>
      <GSC.Square>
        <ProgressBar />
        <GSC.Instructions.Wrapper>
          <GSC.Instructions.Title>
            <Trans i18nKey={phone ? t("instructions") : t("instructions_alt")} components={{ strong: <strong /> }} />
          </GSC.Instructions.Title>
        </GSC.Instructions.Wrapper> 
        {error.length > 0 ? <GSC.Error>{error}</GSC.Error> : null}
        <SC.Input type="text" value={clientValue} onChange={handleChange} placeholder={t("placeholder")} />
        <SC.CallToAction>
          <GSC.ButtonPrimary disabled={!clientValue} type="button" onClick={() => onNext(clientValue)}>
            {t("next")}
          </GSC.ButtonPrimary>
          <GSC.ButtonSecondary type="button" onClick={() => onBack()}>
            {t("back")}
          </GSC.ButtonSecondary>
        </SC.CallToAction>  
        {phone ? <SC.Wrapper>
          <SC.Break.Wrapper>
            <SC.Break.Line></SC.Break.Line>
            <SC.Break.Title>{"ó"}</SC.Break.Title>
            <SC.Break.Line></SC.Break.Line>
          </SC.Break.Wrapper>
          <SC.Message>{t("message")}</SC.Message>
          <SC.User.Name>{name}</SC.User.Name> 
          <SC.User.Wrapper>
            <SC.User.Phone>{mutePhone(phone)}</SC.User.Phone>
            <SC.User.Send onClick={() => onNextSMS()}>{"Enviar SMS"}</SC.User.Send>          
          </SC.User.Wrapper>
        </SC.Wrapper> : null}
      </GSC.Square>      
    </GSC.Wrapper>
  );
};

export default ValidateOptions;

const ProgressBar = () => {
  return (
    <GSC.ProgressBar.Wrapper>
      <svg width="361" height="4" viewBox="0 0 361 4" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="1.57579e-07" y1="2" x2="83.9739" y2="2.00001" stroke="#E30613" stroke-width="4" />
        <line x1="90.8997" y1="2" x2="174.874" y2="2.00001" stroke="#E30613" stroke-width="4" />
        <line x1="186.128" y1="2" x2="270.102" y2="2.00001" stroke="#CBCBCB" stroke-width="4" />
        <line x1="277.026" y1="2" x2="361" y2="2.00001" stroke="#CBCBCB" stroke-width="4" />
      </svg>
    </GSC.ProgressBar.Wrapper>
  );
};