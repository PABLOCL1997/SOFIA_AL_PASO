import React, { Suspense, FC, useState } from "react";

import styled from "styled-components";
import { BREAKPOINT, LG, XL } from "../utils/constants";

export const Wrapper = styled.div`
  position: relative;
`;

export const Marker = styled.div<{ selected: boolean }>`
  position: relative;
  .bounce {
    animation-name: bounce;
    animation-fill-mode: both;
    animation-duration: 1s;
  }

  svg {
    ${({ selected }) =>
      selected === true
        ? `
      fill: #E30613;
      `
        : `
      fill: #767474;
      `}
  }

  @keyframes bounce {
    0% {
      opacity: 0;
      transform: translateY(-2000px) rotate(0);
    }

    60% {
      opacity: 1;
      transform: translateY(30px) rotate(0);
    }

    80% {
      transform: translateY(-10px) rotate(0);
    }

    100% {
      transform: translateY(0) rotate(0);
    }
  }
`;

export const Name = styled.span<{ maxWidth?: string }>`
  font-size: ${(props) => (props.maxWidth ? "12px" : "16px")};

  line-height: 24px;
  display: block;
  width: fit-content;
  color: var(--black);
  background-color: #ffffff;
  text-align: center;
  border-radius: 8px;

  transform: translate(-43%, -100px);
  padding: 10px 20px;
  left: 50%;
  padding: 10px 20px;

  position: absolute;
  width: 220px;
  top: 93px;
  box-shadow: 0 0 15px #ccc;

  margin-top: 62px;
  width: fit-content;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: ${(props) => (props.maxWidth ? props.maxWidth : "550px")};

  top: -15px;

  @media (max-width: ${XL}) {
    /*     max-width:300px; */
    display: none;
  }
`;

type Props = {
  lat: number;
  lng: number;
  text?: string;
  name?: string;
  color?: string;
  maxWidth?: string;
  selected: boolean;
};
const MapMarker: FC<Props> = ({ text, name, maxWidth, selected }) => {
  return (
    <Wrapper>
      {/* <Name maxWidth={maxWidth} title={text}>{name}</Name> */}
      <Marker selected={selected}>
        {/* <img
          className={"bounce"}
          src={MarkerIcon}
          alt={name}
        /> */}

        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="12" />
        </svg>

        {/*    <div className="pulse" /> */}
      </Marker>
    </Wrapper>
  );
};

export default MapMarker;

export const Maps = styled.div`
  width: 100%;
  height: 408px;
  border-radius: 40px;

  .gmnoprint {
    display: none;
  }

  > div > div {
    border-radius: 14px;
  }

  @media (max-width: ${LG}) {
    height: 256px;
    margin: 20px 0;
  }

  @media screen and (max-width: ${BREAKPOINT}) {
    margin: 20px 0 0;
  }
`;
