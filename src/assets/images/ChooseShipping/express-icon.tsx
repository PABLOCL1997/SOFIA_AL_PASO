import React from "react";

const ArrowLeft = (props: any) => {
  const { className, onClick } = props;
  return (
    <div className={className} onClick={onClick}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_2123_5150)">
        <path d="M6.78418 9V7H23.1503V21H6.78418V19" stroke="#E30613" stroke-width="2" stroke-miterlimit="10" stroke-linecap="square"/>
        <path d="M0.646484 16H8.82953" stroke="#E30613" stroke-width="2" stroke-miterlimit="10" stroke-linecap="square"/>
        <path d="M2.69238 12H10.8754" stroke="#E30613" stroke-width="2" stroke-miterlimit="10" stroke-linecap="square"/>
        <path d="M11.8984 7V4C11.8984 3.20435 12.2217 2.44129 12.7972 1.87868C13.3727 1.31607 14.1532 1 14.9671 1V1C15.7809 1 16.5615 1.31607 17.1369 1.87868C17.7124 2.44129 18.0357 3.20435 18.0357 4V7" stroke="#E30613" stroke-width="2" stroke-miterlimit="10"/>
        </g>
        <defs>
        <clipPath id="clip0_2123_5150">
        <rect width="24" height="24" fill="white"/>
        </clipPath>
        </defs>
        </svg>
    </div>
  );
};
export default ArrowLeft;
