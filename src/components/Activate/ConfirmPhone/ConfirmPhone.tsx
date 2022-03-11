import React, { Suspense, FC, useEffect, useState } from "react";
import { useTranslation, Trans, UseTranslationOptions } from "react-i18next";

import * as SC from "./style";
import * as GSC from "../style";
import { ActivateProps } from "../props";

interface Props {
  name: string;
  phone: string;
}

const ActivateConfirmPhone: FC<ActivateProps & Props> = ({ onBack, onNext, error, name, phone }) => {
  const { t } = useTranslation("", { keyPrefix: "activate.steps.confirm_phone" } as UseTranslationOptions);
  const mutePhone = (phone: string) => {
    return phone.length > 6 ? phone.substr(0, 3) + "****" + phone.substr(phone.length - 3) : phone;
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

        {error.length > 0 && <GSC.Error>* {error}</GSC.Error>}
        <SC.Username>{name}</SC.Username>

        <SC.UserPhone>{mutePhone(phone)}</SC.UserPhone>

        <SC.CallToAction>
          <GSC.ButtonPrimary type="button" onClick={() => onNext()}>
            {t("next")}
          </GSC.ButtonPrimary>
          <div></div>
          <GSC.ButtonSecondary type="button" onClick={() => onBack()}>
            {t("back")}
          </GSC.ButtonSecondary>
        </SC.CallToAction>
      </GSC.Square>
    </GSC.Wrapper>
  );
};

export default ActivateConfirmPhone;

const ProgressBar = () => {
  return (
    <GSC.ProgressBar.Wrapper>
      <svg width="361" height="4" viewBox="0 0 361 4" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="1.57579e-07" y1="2" x2="83.9739" y2="2.00001" stroke="#E30613" stroke-width="4" />
        <line x1="90.8997" y1="2" x2="174.874" y2="2.00001" stroke="#E30613" stroke-width="4" />
        <line x1="186.128" y1="2" x2="270.102" y2="2.00001" stroke="#E30613" stroke-width="4" />
        <line x1="277.026" y1="2" x2="361" y2="2.00001" stroke="#CBCBCB" stroke-width="4" />
      </svg>
    </GSC.ProgressBar.Wrapper>
  );
};