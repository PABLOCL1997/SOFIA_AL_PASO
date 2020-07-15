import React from 'react';

const FreeShipping = () => {
    const randomId = `FreeShipping-${(Math.random() * 100000000).toFixed(0)}`;
    return (
        <img className="benefit-icon" src="/images/bag.png" />
    );
}
export default FreeShipping;