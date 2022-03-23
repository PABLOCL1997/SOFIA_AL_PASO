import React, { FC, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PickupIcon, ExpressIcon, DeliveryIcon } from "./Icons";
import useUser from "../../../hooks/useUser";
import { OrderType } from "../../../types/Order";
import * as SC from "./style";

const dictionary  = {
  "PICKUP": "pickup",
  "EXPRESS": "express",
  "ECOMMERCE": "delivery",
  "B2E": "delivery"
}

interface Props {  
  onClick: Function;
}

const ShippingType: FC<Props> = ({ onClick }) => {
  const { t } = useTranslation("", { keyPrefix: "header.shipping_type" });
  const [type, setType] = useState("express");
  const [sizeIcon, setSizeIcon] = useState(20);
  const { store } : { store: OrderType } = useUser();

  useEffect(() => {
    setType(dictionary[store]);
  }, [store]);
  
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