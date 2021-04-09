import React from "react";

const DeliveryBag = () => {
  return (
    <picture>
      <source srcSet={"/images/delivery.webp 2x"} type="image/webp" />
      <source srcSet={"/images/delivery.png 1x"} type="image/jpeg" />
      <img
        width="40px"
        height="40px"
        className="benefit-icon"
        data-src="/images/delivery.png"
        alt="benefit"
      />
    </picture>
  );
};
export default DeliveryBag;
