import React from 'react';

const DeliveryBag = () => {
    const randomId = `DeliveryBag-${(Math.random() * 100000000).toFixed(0)}`;
    return (
        <svg width="74" height="72" viewBox="0 0 74 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse opacity="0.08" cx="36.9672" cy="36" rx="36.8237" ry="36" fill="#E30613" />
            <g clipPath={`url(#${randomId})`}>
                <path d="M28.7842 33V31H45.1503V45H28.7842V43" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
                <path d="M22.6465 40H30.8295" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
                <path d="M24.6924 36H32.8754" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
                <path d="M33.8984 31V28C33.8984 27.2044 34.2217 26.4413 34.7972 25.8787C35.3727 25.3161 36.1532 25 36.9671 25V25C37.7809 25 38.5615 25.3161 39.1369 25.8787C39.7124 26.4413 40.0357 27.2044 40.0357 28V31" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" />
            </g>
            <defs>
                <clipPath id={randomId}>
                    <rect x="21.624" y="24" width="24.5491" height="24" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}
export default DeliveryBag;