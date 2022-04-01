import React, { FC, useEffect } from "react";
import useUser from "../../../hooks/useUser";
import * as SC from "./style"

const PromoBar: FC = () => {
  const { 
    showPromoBar, 
    togglePromoBar, 
    hideBar, 
    store, 
    toggleCityModal, 
    isLoggedIn, 
    toggleLoginModal,
    toggleExpressModal,
    isB2E
   } = useUser();  

  useEffect(() => {
    if (store === "EXPRESS" || isB2E) {
      hideBar();
    } else {
      togglePromoBar();
    }
  }, [store]); 
  
  const handleClickBuy = () => {
    if (!isLoggedIn) {
      toggleLoginModal();
    } else {
      toggleExpressModal();
      toggleCityModal();
    }
  }

  return (
    <SC.Wrapper showPromoBar={showPromoBar}>
      <SC.Title>{"Con Sofía Express, tu pedido inmediato y sin monto mínimo"}</SC.Title>
      <SC.Buy.Button onClick={() => handleClickBuy()}>
        <SC.Buy.TitleDesktop>{"Comprar →"}</SC.Buy.TitleDesktop>
        <SC.Buy.TitleMobile>{"Comprar con Sofia Express →"}</SC.Buy.TitleMobile>
      </SC.Buy.Button>
      <SC.Close onClick={() => hideBar()}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 2L2 16" stroke="#fff" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
          <path d="M16 16L2 2" stroke="#fff" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
        </svg>
      </SC.Close>
    </SC.Wrapper>
  )
};

export default PromoBar;