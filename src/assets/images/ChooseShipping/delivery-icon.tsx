import React from "react";

const ArrowLeft = (props: any) => {
  const { className, onClick } = props;
  return (
    <div className={className} onClick={onClick}>
        <svg width="36" height="38" viewBox="0 0 36 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.1905 2L2 14.9524V36H13.3333V24.6667H23.0476V36H34.381V14.9524L18.1905 2Z" stroke="#E30613" strokeWidth="2.6" strokeMiterlimit="10" strokeLinecap="square" />
        </svg>
    </div>
  );
};
export default ArrowLeft;
