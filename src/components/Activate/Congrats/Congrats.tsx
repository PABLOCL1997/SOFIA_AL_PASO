import React, { Suspense, FC, useEffect, useState } from "react";
import { useTranslation, Trans, UseTranslationOptions } from "react-i18next";

import * as SC from "./style";
import * as GSC from "../style";
import { ActivateProps } from "../props";

const Congrats: FC<ActivateProps> = ({ onBack, onNext }) => {
  const { t } = useTranslation("", { keyPrefix: "activate.steps.congrats" } as UseTranslationOptions);

  return (
    <GSC.Wrapper>
      <GSC.Title>{t("title")}</GSC.Title>
      <GSC.Square>
        <Check />
        <SC.Actions.Wrapper>
          <SC.Actions.Action>
            <SC.Actions.Info>{t("buy.info")}</SC.Actions.Info>
            <SC.Actions.Icon.Wrapper>
              <Gift />
              <SC.Actions.Label.Wrapper>
                <SC.Actions.Label.Label>{t("buy.icon_text")}</SC.Actions.Label.Label>
              </SC.Actions.Label.Wrapper>
            </SC.Actions.Icon.Wrapper>
            <SC.Actions.Button.Wrapper>
              <GSC.ButtonPrimary onClick={() => onBack()}>{t("buy.call_to_action")}</GSC.ButtonPrimary>
            </SC.Actions.Button.Wrapper>
          </SC.Actions.Action>

          <SC.Actions.Action>
            <SC.Actions.Info>
              <Trans i18nKey={t("account.info")} components={{ strong: <strong /> }} />
            </SC.Actions.Info>
            <SC.Actions.Icon.Wrapper>
              <Account />
              <SC.Actions.Label.Wrapper>
                <SC.Actions.Label.Label>{t("account.icon_text")}</SC.Actions.Label.Label>
              </SC.Actions.Label.Wrapper>
            </SC.Actions.Icon.Wrapper>
            <SC.Actions.Button.Wrapper>
              <GSC.ButtonPrimary onClick={() => onNext()}>{t("account.call_to_action")}</GSC.ButtonPrimary>
            </SC.Actions.Button.Wrapper>
          </SC.Actions.Action>
        </SC.Actions.Wrapper>
      </GSC.Square>
    </GSC.Wrapper>
  );
};

export default Congrats;

const Check = () => {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.8335 25.8333L21.5002 34.5L38.8335 17.1666" stroke="#01B368" stroke-width="3" stroke-miterlimit="10" stroke-linecap="square" />
      <path
        d="M25.8333 49.6667C38.9961 49.6667 49.6667 38.9961 49.6667 25.8333C49.6667 12.6705 38.9961 2 25.8333 2C12.6705 2 2 12.6705 2 25.8333C2 38.9961 12.6705 49.6667 25.8333 49.6667Z"
        stroke="#01B368"
        stroke-width="3"
        stroke-miterlimit="10"
        stroke-linecap="square"
      />
    </svg>
  );
};

const Gift = () => {
  return (
    <svg width="98" height="96" viewBox="0 0 98 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse opacity="0.08" cx="49" cy="48" rx="49" ry="48" fill="#E30613" />
      <path
        d="M69.8438 35.4561H27.9062C26.8535 35.4561 26 36.3095 26 37.3623V44.9873C26 46.0401 26.8535 46.8936 27.9062 46.8936H69.8438C70.8965 46.8936 71.75 46.0401 71.75 44.9873V37.3623C71.75 36.3095 70.8965 35.4561 69.8438 35.4561Z"
        stroke="#E30613"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M67.938 46.8933V64.0496C67.938 64.5551 67.7372 65.04 67.3797 65.3975C67.0222 65.755 66.5373 65.9558 66.0317 65.9558H31.7192C31.2137 65.9558 30.7288 65.755 30.3713 65.3975C30.0138 65.04 29.813 64.5551 29.813 64.0496V46.8933"
        stroke="#E30613"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path d="M48.875 35.4561V65.9561" stroke="#E30613" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
      <path
        d="M59.6584 32.7602C56.9625 35.4561 48.875 35.4561 48.875 35.4561C48.875 35.4561 48.875 27.3685 51.5708 24.6727C52.6435 23.6012 54.0978 22.9996 55.6139 23C57.1301 23.0004 58.584 23.6029 59.6561 24.675C60.7282 25.7471 61.3306 27.201 61.3311 28.7171C61.3315 30.2333 60.7298 31.6875 59.6584 32.7602V32.7602Z"
        stroke="#E30613"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M38.0911 32.7602C40.787 35.4561 48.8745 35.4561 48.8745 35.4561C48.8745 35.4561 48.8745 27.3685 46.1787 24.6727C45.106 23.6012 43.6517 22.9996 42.1356 23C40.6194 23.0004 39.1655 23.6029 38.0934 24.675C37.0214 25.7471 36.4189 27.201 36.4185 28.7171C36.418 30.2333 37.0197 31.6875 38.0911 32.7602V32.7602Z"
        stroke="#E30613"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

const Account = () => {
  return (
    <svg width="98" height="96" viewBox="0 0 98 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse opacity="0.08" cx="49" cy="48" rx="49" ry="48" fill="#E30613" />
      <path d="M45.7304 27L31 38.7843V57.9338H41.3113V47.6225H50.1495V57.9338H60.4608V38.7843L45.7304 27Z" stroke="#E30613" stroke-width="2.6" stroke-miterlimit="10" stroke-linecap="square" />
      <path
        d="M63.0605 58.364C66.9098 58.364 70.0302 55.2435 70.0302 51.3943C70.0302 47.545 66.9098 44.4246 63.0605 44.4246C59.2113 44.4246 56.0908 47.545 56.0908 51.3943C56.0908 55.2435 59.2113 58.364 63.0605 58.364Z"
        fill="#FFF0F1"
        stroke="#E30613"
        stroke-width="2.6"
        stroke-miterlimit="10"
      />
      <path
        d="M52.4956 64.4613C53.5667 62.6073 55.1069 61.0678 56.9613 59.9975C58.8158 58.9272 60.9192 58.3638 63.0604 58.3638C65.2015 58.3639 67.305 58.9273 69.1594 59.9977C71.0139 61.068 72.554 62.6075 73.6251 64.4615"
        stroke="#E30613"
        stroke-width="2.6"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
