import React, { Suspense, FC, useEffect, useState } from "react";
import { useTranslation, Trans, UseTranslationOptions } from "react-i18next";

import * as SC from "./style";
import * as GSC from "../style";
import { ActivateProps } from "../props";

interface Props {
  token: string;
  setToken: Function;
  phone: string;
}

const WritePin: FC<ActivateProps & Props> = ({ onBack, onNext, error, setToken, phone }) => {
  const { t } = useTranslation("", { keyPrefix: "activate.steps.write_pin" } as UseTranslationOptions);
  const subject: string = t("mail_subject");
  const body: string = t("mail_body");
  const mailTo: string = `mailto:etoledo@avicolasofia.com?subject=${subject.replace(" ", "%20")}&body=${body.replace(" ", "%20")}`;
  const mutePhone = (phone: string) => {
    return phone.length > 6 ? phone.substr(0, 3) + "****" + phone.substr(phone.length - 3) : phone;
  };
  const fiveMinutes: number = 5 * 60;
  const second: number = 1000;

  const [pin1, setPin1] = useState<any>("");
  const [pin2, setPin2] = useState<any>("");
  const [pin3, setPin3] = useState<any>("");
  const [pin4, setPin4] = useState<any>("");
  const [pin5, setPin5] = useState<any>("");
  const [pin6, setPin6] = useState<any>("");
  const [pinError, setPinError] = useState(false);
  const [pinValue, setPinValue] = useState<string>("");

  const [counter, setCounter] = useState<number>(fiveMinutes);
  const [minutes, setMinutes] = useState<number>(counter / 60);
  const [seconds, setSeconds] = useState<number>(counter % 60);

  const handleChangePin1 = (evt: { target: { validity: { valid: any }; value: any } }) => {
    const pin1Valid = evt.target.validity.valid ? evt.target.value : pin1;

    setPin1(pin1Valid);
  };
  const handleChangePin2 = (evt: { target: { validity: { valid: any }; value: any } }) => {
    const pin2Valid = evt.target.validity.valid ? evt.target.value : pin2;

    setPin2(pin2Valid);
  };
  const handleChangePin3 = (evt: { target: { validity: { valid: any }; value: any } }) => {
    const pin3Valid = evt.target.validity.valid ? evt.target.value : pin3;

    setPin3(pin3Valid);
  };
  const handleChangePin4 = (evt: { target: { validity: { valid: any }; value: any } }) => {
    const pin4Valid = evt.target.validity.valid ? evt.target.value : pin4;

    setPin4(pin4Valid);
  };
  const handleChangePin5 = (evt: { target: { validity: { valid: any }; value: any } }) => {
    const pin5Valid = evt.target.validity.valid ? evt.target.value : pin5;

    setPin5(pin5Valid);
  };
  const handleChangePin6 = (evt: { target: { validity: { valid: any }; value: any } }) => {
    const pin6Valid = evt.target.validity.valid ? evt.target.value : pin6;

    setPin6(pin6Valid);
  };

  useEffect(() => {
    if (pin1 && pin2 && pin3 && pin4 && pin5 && pin6) {
      setPinValue(pin1 + pin2 + pin3 + pin4 + pin5 + pin6);
      setToken(pin1 + pin2 + pin3 + pin4 + pin5 + pin6);
    }
  }, [pin1, pin2, pin3, pin4, pin5, pin6]);

  useEffect(() => {
    if (counter > 0) setTimeout(() => setCounter(counter - 1), second);
    setMinutes(Math.floor(counter / 60));
    setSeconds(Math.floor(counter % 60));
  }, [counter]);

  const pinConfig = {
    placeholder: "",
    type: "tel",
    maxLength: 1,
    pattern: "[0-9]*",
    autoComplete: "off",
    pinError: pinError,
  };

  return (
    <GSC.Wrapper>
      <GSC.Title>{t("title")}</GSC.Title>
      <GSC.Square>
        <ProgressBar />

        <GSC.Instructions.Wrapper>
          <GSC.Instructions.Title>
            <Trans i18nKey={t("instructions", { phone: mutePhone(phone) })} components={{ strong: <strong /> }} />
          </GSC.Instructions.Title>
        </GSC.Instructions.Wrapper>

        <SC.Timer.Wrapper>
          <SC.Timer.Time>
            {minutes >= 10 ? minutes : `0${minutes}`}:{seconds >= 10 ? seconds : `0${seconds}`}
          </SC.Timer.Time>
        </SC.Timer.Wrapper>
        {error.length > 0 && <GSC.Error style={{ textAlign: "center", margin: "10px 0 0 0" }}>* {error}</GSC.Error>}
        <SC.Inputs.Wrapper>
          {pin2 === "" && pin1 !== "" ? (
            <>
              <SC.Inputs.Input {...pinConfig} name="first" onChange={handleChangePin1} value={pin1} autoFocus className={pin1 !== "" ? "filled" : ""} />
            </>
          ) : (
            <SC.Inputs.Input {...pinConfig} name="first" onChange={handleChangePin1} value={pin1} className={pin1 !== "" ? "filled" : ""} />
          )}

          {pin1 !== "" && pin3 === "" ? (
            <>
              <SC.Inputs.Input {...pinConfig} name="second" onChange={handleChangePin2} value={pin2} autoFocus className={pin2 !== "" ? "filled" : ""} />
            </>
          ) : (
            <SC.Inputs.Input {...pinConfig} name="second" onChange={handleChangePin2} value={pin2} className={pin2 !== "" ? "filled" : ""} />
          )}

          {pin1 !== "" && pin2 !== "" && pin4 === "" ? (
            <>
              <SC.Inputs.Input {...pinConfig} name="third" onChange={handleChangePin3} value={pin3} className={pin3 !== "" ? "filled" : ""} autoFocus />
            </>
          ) : (
            <SC.Inputs.Input {...pinConfig} name="third" onChange={handleChangePin3} className={pin3 !== "" ? "filled" : ""} value={pin3} />
          )}

          {pin1 !== "" && pin2 !== "" && pin3 !== "" && pin5 === "" ? (
            <>
              <SC.Inputs.Input {...pinConfig} name="four" onChange={handleChangePin4} value={pin4} className={pin4 !== "" ? "filled" : ""} autoFocus />
            </>
          ) : (
            <SC.Inputs.Input {...pinConfig} name="four" onChange={handleChangePin4} className={pin4 !== "" ? "filled" : ""} value={pin4} />
          )}

          {pin1 !== "" && pin2 !== "" && pin3 !== "" && pin4 !== "" && pin6 === "" ? (
            <>
              <SC.Inputs.Input {...pinConfig} name="five" onChange={handleChangePin5} value={pin5} className={pin5 !== "" ? "filled" : ""} autoFocus />
            </>
          ) : (
            <SC.Inputs.Input {...pinConfig} name="five" onChange={handleChangePin5} className={pin5 !== "" ? "filled" : ""} value={pin5} />
          )}

          {pin1 !== "" && pin2 !== "" && pin3 !== "" && pin4 !== "" && pin5 !== "" ? (
            <>
              <SC.Inputs.Input {...pinConfig} name="six" onChange={handleChangePin6} value={pin6} className={pin6 !== "" ? "filled" : ""} autoFocus />
            </>
          ) : (
            <SC.Inputs.Input {...pinConfig} name="six" onChange={handleChangePin6} className={pin6 !== "" ? "filled" : ""} value={pin6} />
          )}
        </SC.Inputs.Wrapper>

        <SC.Resend.Wrapper>
          <SC.Resend.Link aria-disabled={counter > 0} onClick={() => onBack()}>
            {t("resend")}
          </SC.Resend.Link>
        </SC.Resend.Wrapper>

        <SC.CallToAction>
          <GSC.ButtonPrimary disabled={!(pin1 && pin2 && pin3 && pin4 && pin5 && pin6)} onClick={() => onNext()}>
            {t("next")}
          </GSC.ButtonPrimary>
          <GSC.ButtonSecondary onClick={() => onBack()}>{t("back")}</GSC.ButtonSecondary>
        </SC.CallToAction>

        <SC.Help.Wrapper>
          <HelpIcon />
          <SC.Help.Text>
            <Trans i18nKey={t("help")} components={{ sofialink: <a href={mailTo} target="_blank" /> }} />
          </SC.Help.Text>
        </SC.Help.Wrapper>
      </GSC.Square>
    </GSC.Wrapper>
  );
};

export default WritePin;

const ProgressBar = () => {
  return (
    <GSC.ProgressBar.Wrapper>
      <svg width="361" height="4" viewBox="0 0 361 4" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="1.57579e-07" y1="2" x2="83.9739" y2="2.00001" stroke="#E30613" stroke-width="4" />
        <line x1="90.8997" y1="2" x2="174.874" y2="2.00001" stroke="#E30613" stroke-width="4" />
        <line x1="186.128" y1="2" x2="270.102" y2="2.00001" stroke="#E30613" stroke-width="4" />
        <line x1="277.026" y1="2" x2="361" y2="2.00001" stroke="#E30613" stroke-width="4" />
      </svg>
    </GSC.ProgressBar.Wrapper>
  );
};

const HelpIcon = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 16C3.6 16 0 12.4 0 8C0 3.6 3.6 0 8 0C12.4 0 16 3.6 16 8C16 12.4 12.4 16 8 16ZM8 2C4.7 2 2 4.7 2 8C2 11.3 4.7 14 8 14C11.3 14 14 11.3 14 8C14 4.7 11.3 2 8 2Z" fill="#2F2F2F" />
      <path d="M9 12H7V7H9V12Z" fill="#2F2F2F" />
      <path d="M8 4C8.55228 4 9 4.44772 9 5C9 5.55228 8.55228 6 8 6C7.44772 6 7 5.55228 7 5C7 4.44772 7.44772 4 8 4Z" fill="#2F2F2F" />
    </svg>
  );
};