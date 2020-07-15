import React from 'react';

const Wallet = () => {
    const randomId = `Wallet-${(Math.random() * 100000000).toFixed(0)}`;
    return (
        <img className="benefit-icon" src="/images/wallet.png" />
    );
}
export default Wallet;