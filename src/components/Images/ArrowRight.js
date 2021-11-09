import React from "react";

const ArrowRight = (props) => {
  const randomId = `ArrowRight-${(Math.random() * 100000000).toFixed(0)}`;
  const { className, onClick } = props;
  return (
    <div className={className} onClick={onClick}>
      <svg width="156" height="174" viewBox="0 0 156 174" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter={`url(#${randomId})`}>
          <circle cx="87.666" cy="83" r="23" transform="rotate(-180 87.666 83)" fill="white" />
        </g>
        <path d="M80.166 82.5L95.166 82.5" stroke="#2F2F2F" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M90.166 87.5L95.166 82.5L90.166 77.5" stroke="#2F2F2F" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <defs>
          <filter id={randomId} x="0.666016" y="0" width="174" height="174" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="32" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
          </filter>
        </defs>
      </svg>
    </div>
  );
};
export default ArrowRight;
