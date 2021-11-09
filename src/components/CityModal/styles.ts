import styled from "styled-components";
import { BREAKPOINT } from "../../utils/constants";

export const Courtain = styled.div<any>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: none;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  z-index: 400;
  &.visible {
    display: flex;
  }
`;

export const Modal = styled.div`
  position: relative;
  background: white;
  border-radius: 10px;
  padding: 50px;
  text-align: center;
  @media screen and (max-width: ${BREAKPOINT}) {
    margin: 0 20px;
    padding: 40px 20px;
  }
`;

export const CloseWrapper = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  > svg {
    width: 12px;
    height: 12px;
  }
`;

export const StarWrap = styled.div`
  position: relative;
  display: inline-block;
  &:hover {
    > div {
      opacity: 1;
      visibility: visible;
    }
  }

  & > img {
    margin-top: -2px;
    margin-left: 2px;
  }
`;
export const TooltipStar = styled.div`
  text-align: center;

  padding: 20px 10px;
  width: 287px;
  background: #f0f0f0;
  border-radius: 8px;
  font-size: 12px;
  line-height: 18px;

  left: 50%;
  margin-left: -141px;
  right: 0;
  top: 30px;

  color: #1a1a1a;
  position: absolute;

  transition: all ease-out 0.2s;

  opacity: 0;
  visibility: hidden;

  z-index: 2;

  /* &.hover {
    opacity: 1;
    visibility: visible;
  } */

  &:before {
    content: "";
    width: 20px;
    height: 20px;
    background-color: #f0f0f0;
    transform: rotate(45deg);
    position: absolute;
    top: -5px;
    left: 50%;
    margin-left: -10px;
  }

  @media (max-width: ${BREAKPOINT}) {
    display: none;
  }
`;
