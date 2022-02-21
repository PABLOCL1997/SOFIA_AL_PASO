import React from "react";

const ArrowLeft = (props: any) => {
  const { className, onClick } = props;
  return (
    <div className={className} onClick={onClick}>
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0)">
            <path
              d="M32.5 1.25H7.5L1.25 12.5C1.25 15.9525 4.0475 18.75 7.5 18.75C10.9525 18.75 13.75 15.9525 13.75 12.5C13.75 15.9525 16.5475 18.75 20 18.75C23.4525 18.75 26.25 15.9525 26.25 12.5C26.25 15.9525 29.0475 18.75 32.5 18.75C35.9525 18.75 38.75 15.9525 38.75 12.5L32.5 1.25Z"
              stroke="#E30613"
              strokeWidth="2.6"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M33.75 23.75V38.75H6.25V23.75" stroke="#E30613" strokeWidth="2.6" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16.25 38.75V28.75H23.75V38.75" stroke="#E30613" strokeWidth="2.6" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <defs>
            <clipPath id="clip0">
              <rect width="40" height="40" fill="white" />
            </clipPath>
          </defs>
      </svg>
    </div>
  );
};
export default ArrowLeft;
