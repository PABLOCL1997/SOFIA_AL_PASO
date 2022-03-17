import React, { FC, useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import { ActivateProps } from "../props";
import WhatsAppButton from "../WhatsAppButton";

import * as SC from "./style";
import * as GSC from "../style";

const InsertEmployeeCode: FC<ActivateProps> = ({ onBack, onNext, error}) => {
  const { t } = useTranslation("", { keyPrefix: "activate.steps.insert_employee_code" }); 
  const [employeeCode, setEmployeeCode] = useState("");

  const handleChange = (event: {target: { value: string } }) => {
    const value = event.target.value;
    if (!isNaN(Number(value)) && value.length <= 10) {
      setEmployeeCode(value);
    }
  }  

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
        <SC.Input value={employeeCode} onChange={handleChange} type="text" placeholder={t("placeholder")} />
        {error.length > 0 ? 
          <>
            <GSC.Error>{error}</GSC.Error>
            <WhatsAppButton title={t("whatsapp_title")} link={t("whatsapp_link")}/>  
          </>        
        : null}       
        <SC.CallToAction>          
          <GSC.ButtonPrimary disabled={!employeeCode} type="button" onClick={() => onNext(employeeCode)}>
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

export default InsertEmployeeCode;

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