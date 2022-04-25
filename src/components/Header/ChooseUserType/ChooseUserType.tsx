import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useMutation } from "react-apollo";
import { SET_USER } from "../../../graphql/user/mutations";
import * as SC from "./style";

import { useModals } from "../../../state/slices/modals/useModals";
import { useCheckout } from "../../../state/slices/checkout/useCheckout";

import CloseModalIcon from "../../../assets/images/close-modal.svg";
import GuestIcon from "../../../assets/images/Compra-guest.svg";
import RegisterIcon from "../../../assets/images/Registrate.svg";
import LoginIcon from "../../../assets/images/IniciaSesion.svg";

interface Option {
  img: string;
  title: string;
  description: string;
  onClick: () => void;
  selected: boolean;
  showNew: boolean;
}

const Option = ({ img, title, description, onClick, selected, showNew }: Option) => {
  return (
    <SC.Option.Wrapper>
      <SC.Option.Box selected={selected} onClick={onClick}>
        <SC.Option.Icon loading={"lazy"} src={img} alt={img} />
        <SC.Option.Title>{title}</SC.Option.Title>
        {showNew ? <SC.Option.New>Nuevo</SC.Option.New> : null}
      </SC.Option.Box>
      <SC.Option.Description>{description}</SC.Option.Description>
    </SC.Option.Wrapper>
  );
};

const ChooseUserType = () => {
  const { t } = useTranslation("", { keyPrefix: "header.choose_user_type" });
  const history = useHistory();
  const { handleChooseUserType, handleRegisterModal } = useModals();
  const { handleRedirectToCheckout, handleIsGuestOrder } = useCheckout();

  const [openLoginModal] = useMutation(SET_USER, {
    variables: {
      user: {
        openLoginModal: true,
      },
    },
  });

  const closeModal = () => {
    handleChooseUserType(false);
  };

  const handleLogin = () => {
    openLoginModal();
    handleChooseUserType(false);
    handleRedirectToCheckout(true);
  };

  const handleGuest = () => {
    history.push("/checkout");
    handleChooseUserType(false);
    handleIsGuestOrder(true);
  };

  const handleRegister = () => {
    handleRegisterModal(true);
    handleChooseUserType(false);
    handleRedirectToCheckout(true);
    openLoginModal();
  };

  const options = [
    {
      img: LoginIcon,
      title: t("login.title"),
      description: t("login.description"),
      onClick: handleLogin,
      selected: true,
      showNew: false,
    },
    {
      img: GuestIcon,
      title: t("guest.title"),
      description: t("guest.description"),
      onClick: handleGuest,
      selected: false,
      showNew: true,
    },
    {
      img: RegisterIcon,
      title: t("singup.title"),
      description: t("singup.description"),
      onClick: handleRegister,
      selected: false,
      showNew: false,
    },
  ];

  return (
    <SC.ModalCourtain>
      <SC.Modal>
        <SC.Title>{t("title")}</SC.Title>
        <SC.CloseIcon src={CloseModalIcon} alt="CloseModalIcon" onClick={closeModal} />
        <SC.Options>
          {options.map((o, i) => (
            <Option key={`${o.img}_${i}`} img={o.img} title={o.title} description={o.description} onClick={o.onClick} selected={o.selected} showNew={o.showNew}/>
          ))}
        </SC.Options>
      </SC.Modal>      
    </SC.ModalCourtain>
  );
};

export default ChooseUserType;