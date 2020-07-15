import React from 'react';

const DeliveryBag = () => {
    const randomId = `DeliveryBag-${(Math.random() * 100000000).toFixed(0)}`;
    return (
        <img className="benefit-icon" src="/images/delivery.png" />
    );
}
export default DeliveryBag;