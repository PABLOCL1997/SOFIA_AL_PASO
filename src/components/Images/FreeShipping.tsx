import React from "react";

const FreeShipping = () => {
  return (
    
  
    <picture>
      <source srcSet={"/images/bag.webp 2x"} type="image/webp" />
      <source srcSet={"/images/bag.png 1x"} type="image/jpeg" />
      <img
        width="40px"
        height="40px"
        className="benefit-icon"
        data-src="/images/bag.png"
        alt="benefit"
      />
    </picture>
 
  );
};
export default FreeShipping;
