import React from "react";

const Wallet = () => {
  return (
    /*   <img className="lazyload" data-src="/images/wallet.png" alt="wallet" /> */

    <picture>
      <source srcSet={"/images/wallet.webp 2x"} type="image/webp" />
      <source srcSet={"/images/wallet.png 1x"} type="image/jpeg" />
      <img
        width="40px"
        height="40px"
        className="benefit-icon"
        data-src="/images/wallet.png"
        alt="wallet"
      />
    </picture>
  );
};
export default Wallet;
