import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useMutation } from "react-apollo";
import { SET_USER } from "../../../graphql/user/mutations";
import * as SC from "./style";
import Cta from "../../Cta";

import { useModals } from "../../../state/slices/modals/useModals";
import { useCheckout } from "../../../state/slices/checkout/useCheckout";

import IconCompra from "../../../assets/images/Compra.svg";
import ArrowBack from "../../../assets/images/arrow-back-checkout.svg";
import CloseModalIcon from "../../../assets/images/close-modal.svg";

const ChooseUserType = () => {
  const { t } = useTranslation("", { keyPrefix: "header.choose_user_type" });
  const [showGuestStep, setShowGuestStep] = useState(false);
  const history = useHistory();
  const { handleChooseUserType, handleRegisterModal } = useModals();
  const { handleRedirectToCheckout } = useCheckout();
  const [openLoginModal] = useMutation(SET_USER, {
    variables: {
      user: {
        openLoginModal: true
      }
    }
  });    

  const closeModal = () => {
    handleChooseUserType(false);
  }

  const handleClient = () => {
    openLoginModal();
    handleChooseUserType(false);
    handleRedirectToCheckout(true);
  }

  const handleGuest = () => {
    history.push("/checkout");
    handleChooseUserType(false);
  }

  const handleRegister = () => {
    handleRegisterModal(true);
    handleChooseUserType(false);
    handleRedirectToCheckout(true);
    openLoginModal();
  }

  return (
   <SC.ModalCourtain>
     {!showGuestStep ? 
      <SC.Modal>
        <SC.Header>
          <SC.Title>{t("title")}</SC.Title>
          <SC.Icon src={CloseModalIcon} alt="CloseModalIcon" onClick={closeModal}/>
        </SC.Header>
        <SC.CtaWrapper>
          <Cta filled={true} text={t("option_client")} action={handleClient}/>
          <Cta filled={false} text={t("option_not_client")} action={() => setShowGuestStep(true)}/>
        </SC.CtaWrapper>
      </SC.Modal> : 
      <SC.Modal>
        <SC.Header>
          <SC.Icon src={ArrowBack} alt="ArrowBack" onClick={() => setShowGuestStep(false)}/>
          <SC.Title>{t("option_not_client")}</SC.Title>
          <SC.Icon src={CloseModalIcon} alt="CloseModalIcon" onClick={closeModal}/>
        </SC.Header>
        <SC.BuyIcon src={IconCompra} alt="iconCompra" />
        <SC.CtaWrapper>
          <h4>{t("guest.title_one")}</h4>
          <Cta filled={true} text={t("guest.btn_one")} action={handleGuest}/>
          <h4>{t("guest.title_two")}</h4>
          <Cta filled={false} text={t("guest.btn_two")} action={handleRegister}/>
        </SC.CtaWrapper>
      </SC.Modal>
     }
   </SC.ModalCourtain>
  )
}

export default ChooseUserType