import React from 'react';

const FreeShipping = () => {
    const randomId = `FreeShipping-${(Math.random() * 100000000).toFixed(0)}`;
    return (
        <svg width="66" height="64" viewBox="0 0 66 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse opacity="0.08" cx="32.9675" cy="32" rx="32.7322" ry="32" fill="#E30613" />
            <g clipPath={`url(#${randomId})`}>
                <g clipPath={`url(#${randomId + 2})`}>
                    <path d="M21.7148 22H44.2182" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
                    <path d="M32.9668 22V26" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
                    <path d="M42.1726 26H23.7607V42H42.1726V26Z" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
                    <path d="M32.9669 39C35.7915 39 38.0813 36.7614 38.0813 34C38.0813 31.2386 35.7915 29 32.9669 29C30.1423 29 27.8525 31.2386 27.8525 34C27.8525 36.7614 30.1423 39 32.9669 39Z" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
                    <path d="M32.9662 34L31.9434 33" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
                </g>
            </g>
            <defs>
                <clipPath id={randomId}>
                    <rect x="20.6924" y="20" width="24.5491" height="24" fill="white" />
                </clipPath>
                <clipPath id={randomId + 2}>
                    <rect x="20.6924" y="20" width="24.5491" height="24" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}
export default FreeShipping;