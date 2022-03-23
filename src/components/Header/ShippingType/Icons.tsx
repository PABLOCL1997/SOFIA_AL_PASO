import React, { FC } from "react"

const iconColor = "var(--icon-color)"

interface PropsIcon {
  size: number;
}

export const PickupIcon: FC<PropsIcon> = ({ size }) => {  
  return (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0)">
            <path
              d="M32.5 1.25H7.5L1.25 12.5C1.25 15.9525 4.0475 18.75 7.5 18.75C10.9525 18.75 13.75 15.9525 13.75 12.5C13.75 15.9525 16.5475 18.75 20 18.75C23.4525 18.75 26.25 15.9525 26.25 12.5C26.25 15.9525 29.0475 18.75 32.5 18.75C35.9525 18.75 38.75 15.9525 38.75 12.5L32.5 1.25Z"
              stroke={iconColor}
              strokeWidth="2.6"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M33.75 23.75V38.75H6.25V23.75" stroke={iconColor} strokeWidth="2.6" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16.25 38.75V28.75H23.75V38.75" stroke={iconColor} strokeWidth="2.6" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <defs>
            <clipPath id="clip0">
              <rect width="40" height="40" fill="white" />
            </clipPath>
          </defs>
      </svg>
  );
};

export const ExpressIcon: FC<PropsIcon> = ({ size }) => { 
  return (    
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_2123_5150)">
            <path d="M6.78418 9V7H23.1503V21H6.78418V19" stroke={iconColor} strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
            <path d="M0.646484 16H8.82953" stroke={iconColor} strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
            <path d="M2.69238 12H10.8754" stroke={iconColor} strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
            <path d="M11.8984 7V4C11.8984 3.20435 12.2217 2.44129 12.7972 1.87868C13.3727 1.31607 14.1532 1 14.9671 1V1C15.7809 1 16.5615 1.31607 17.1369 1.87868C17.7124 2.44129 18.0357 3.20435 18.0357 4V7" stroke={iconColor} strokeWidth="2" strokeMiterlimit="10"/>
          </g>
          <defs>
            <clipPath id="clip0_2123_5150">
              <rect width="24" height="24" fill="white"/>
            </clipPath>
          </defs>
        </svg>
  );
};

export const DeliveryIcon: FC<PropsIcon> = ({ size }) => {
  return (
      <svg width={size} height={size} viewBox="0 0 36 38" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.1905 2L2 14.9524V36H13.3333V24.6667H23.0476V36H34.381V14.9524L18.1905 2Z" 
            stroke={iconColor}
            strokeWidth="2.6" 
            strokeMiterlimit="10" 
            strokeLinecap="square" 
          />
      </svg>
  );
};