import React, { FC, Suspense } from "react";
import styled from "styled-components";

const ArrowButton = styled.div<{ background: string, color: string, rotate: string}>`
    cursor: pointer;
    display:flex;
    justify-content: center;
    align-items: center;
    width: 46px;
    height: 46px;
    border-radius: 50% ;
    box-shadow: 0px 17px 36px rgba(0, 0, 0, 0.3);

    ${({ background, color, rotate }) => 
    `
        background: ${background};
        color: ${color};

        svg {
            cursor: pointer;
            transform: rotate(${rotate});
        }
    `
    }
`

interface Props {
    background: string;
    color: string;
    rotate: string;
    onClick: Function;
}

const Arrow: FC <Props> = ({ onClick, background, color, rotate }) => {
    return (
        <ArrowButton onClick={() => onClick()} background={background} color={color} rotate={rotate}>
            <svg width="13" height="18" viewBox="0 0 13 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.16602 16.5L6.16602 1.5" stroke="#2F2F2F" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11.166 6.5L6.16602 1.5L1.16602 6.5" stroke="#2F2F2F" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </ArrowButton>
    )
}

export default Arrow