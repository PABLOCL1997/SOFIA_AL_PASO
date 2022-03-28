import React, { FC, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PickupIcon, ExpressIcon, DeliveryIcon } from "./Icons";
import useUser from "../../../hooks/useUser";
import { OrderType } from "../../../types/Order";
import * as SC from "./style";

enum ServiceType {
  PICKUP = "pickup",
  EXPRESS = "express",
  ECOMMERCE = "delivery",
  B2E = "delivery"
}

interface Props {  
  onClick: Function;
}

const ShippingType: FC<Props> = ({ onClick }) => {
  const { t } = useTranslation("", { keyPrefix: "header.shipping_type" });
  const { store } : { store: OrderType } = useUser();
  const type = ServiceType[store] || ServiceType.EXPRESS;
  const [sizeIcon, setSizeIcon] = useState(20);

  useEffect(() => {
    const resize = () => {
      if (window.innerWidth < 768) {
        setSizeIcon(30);
      } else {
        setSizeIcon(20);
      }
    }
    resize();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    }
  },[]);
  
  return (
    <SC.Wrapper>
      <SC.Button onClick={() => onClick()}>
        {type === "pickup" ? <PickupIcon size={sizeIcon}/> : null}
        {type === "express" ? <ExpressIcon size={sizeIcon}/> : null}
        {type === "delivery" ? <DeliveryIcon size={sizeIcon}/> : null}
        <SC.Title>{t(type)}</SC.Title>
        <SC.Arrow></SC.Arrow>
      </SC.Button> 
    </SC.Wrapper>
  );
};

export default ShippingType;