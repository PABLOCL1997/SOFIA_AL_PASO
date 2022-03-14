import React, { Suspense, FC, useEffect, useState } from "react";
import { useTranslation, Trans, UseTranslationOptions } from "react-i18next";
import logo from "../../../assets/activate/whatsapp-logo.png";

import * as SC from "./style";
import * as GSC from "../style";
import { ActivateProps } from "../props";

interface Props {
  setNit: Function;
  nit: string | null;
}

const InsertNit: FC<ActivateProps & Props> = ({ onBack, onNext, error, setNit, nit }) => {
  const { t } = useTranslation("", { keyPrefix: "activate.steps.insert_nit" } as UseTranslationOptions);
  const handleChange = (evt: { target: { validity: { valid: any }; value: any } }) => {
    const value = evt.target.validity.valid ? evt.target.value : nit;
    if (value.length <= 30) setNit(value);
  };

  return (
    <GSC.Wrapper>
      <GSC.Title>{t("title")}</GSC.Title>
      <GSC.Square>
        <ProgressBar />
        <GSC.Instructions.Wrapper>
          <GSC.Instructions.Title>
            <Trans i18nKey={t("instructions")} components={{ strong: <strong /> }} />
          </GSC.Instructions.Title>
        </GSC.Instructions.Wrapper>
        <SC.Input min={0} type="text" pattern="[0-9]*" value={String(nit)} onChange={handleChange} placeholder={t("placeholder")} />
        {error.length > 0 && 
        <>
          <GSC.Error>{error}</GSC.Error>
          {error === t("error") ? <SC.Link href={t("bienestar_link")} target="_blank">
            <SC.LogoWhatsApp.Wrapper>
              <SC.LogoWhatsApp.Img src={logo} alt="logo_whatsapp"/>
              <SC.LogoWhatsApp.Title>{"Bienestar Organizacional"}</SC.LogoWhatsApp.Title>
            </SC.LogoWhatsApp.Wrapper>
          </SC.Link> : null}
        </>}
        <SC.CallToAction>
          <GSC.ButtonPrimary disabled={!String(nit).length} onClick={() => onNext()}>
            {t("next")}
          </GSC.ButtonPrimary>
        </SC.CallToAction>
      </GSC.Square>
    </GSC.Wrapper>
  );
};

export default InsertNit;

const ProgressBar = () => {
  return (
    <GSC.ProgressBar.Wrapper>
      <svg width="361" height="4" viewBox="0 0 361 4" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="1.57579e-07" y1="2" x2="83.9739" y2="2.00001" stroke="#E30613" stroke-width="4" />
        <line x1="186.128" y1="2" x2="270.102" y2="2.00001" stroke="#CBCBCB" stroke-width="4" />
        <line x1="90.8997" y1="2" x2="174.874" y2="2.00001" stroke="#CBCBCB" stroke-width="4" />
        <line x1="277.026" y1="2" x2="361" y2="2.00001" stroke="#CBCBCB" stroke-width="4" />
      </svg>
    </GSC.ProgressBar.Wrapper>
  );
};
