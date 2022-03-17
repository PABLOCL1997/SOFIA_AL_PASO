import React, { FC, useState } from "react";
import { useTranslation, Trans, UseTranslationOptions } from "react-i18next";

import * as SC from "./style";
import * as GSC from "../style";

interface Props {
  onNext: Function;
  onBack: Function;
  phone: string;
}

const ValidateOptions: FC<Props> = ({ onBack, onNext, phone}) => {
  const { t } = useTranslation("", { keyPrefix: "activate.steps.validate_options" } as UseTranslationOptions); 
  const [selected, setSelected] = useState("");
  const instructionsSelected = {
    code: t("instructions_code"),
    sms: t("instructions_sms")
  } 
   
  return (
    <GSC.Wrapper>
      <GSC.Title>{t("title")}</GSC.Title>
      <GSC.Square>
        <ProgressBar />
        <GSC.Instructions.Wrapper>
          <GSC.Instructions.Title>
            <Trans i18nKey={!selected ? t("instructions") : instructionsSelected[selected as keyof typeof instructionsSelected]} components={{ strong: <strong /> }} />
          </GSC.Instructions.Title>
        </GSC.Instructions.Wrapper>         
        <SC.Options.Wrapper>
          <SC.Options.Button selected={selected === "code"} onClick={() => setSelected("code")}>{"Código de empleado"}</SC.Options.Button>
          <SC.Options.Button selected={selected === "sms"} onClick={() => setSelected("sms")} disabled={!phone} active={!phone}>{"SMS"}</SC.Options.Button>
        </SC.Options.Wrapper>
        <SC.CallToAction>          
          <GSC.ButtonPrimary disabled={!selected} type="button" onClick={() => onNext(selected)}>
            {t("next")}
          </GSC.ButtonPrimary>
          <GSC.ButtonSecondary type="button" onClick={() => onBack()}>
            {t("back")}
          </GSC.ButtonSecondary>
        </SC.CallToAction>          
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