import React from 'react';

const Wallet = () => {
    const randomId = `Wallet-${(Math.random() * 100000000).toFixed(0)}`;
    return (
        <svg width="74" height="72" viewBox="0 0 74 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse opacity="0.08" cx="36.9672" cy="36" rx="36.8237" ry="36" fill="#E30613" />
            <g clipPath={`url(#${randomId})`}>
                <path d="M30.8292 27H27.7606C26.6303 27 25.7148 27.895 25.7148 29C25.7148 30.105 26.6303 31 27.7606 31" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
                <path d="M30.8291 31V25H45.1494V31" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
                <path d="M48.2182 31H27.7606C26.6303 31 25.7148 30.105 25.7148 29V44C25.7148 45.657 27.0886 47 28.7835 47H48.2182V31Z" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
                <path d="M42.0809 41C43.2108 41 44.1267 40.1046 44.1267 39C44.1267 37.8954 43.2108 37 42.0809 37C40.9511 37 40.0352 37.8954 40.0352 39C40.0352 40.1046 40.9511 41 42.0809 41Z" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
            </g>
            <defs>
                <clipPath id={randomId}>
                    <rect x="24.6924" y="24" width="24.5491" height="24" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}
export default Wallet;