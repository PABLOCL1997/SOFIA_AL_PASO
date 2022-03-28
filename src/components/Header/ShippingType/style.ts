import styled from "styled-components";
import { BREAKPOINT, XL } from "../../../utils/constants";

export const Wrapper = styled.div`
  --icon-color: white;
  @media screen and (max-width: ${BREAKPOINT}) {
    --icon-color: var(--red);
  }
`

export const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 100%;
  max-width: 180px;
  height: 28px;
  background-color: var(--red);
  border: none;  
  border-radius: 30px;
  @media screen and (max-width: ${BREAKPOINT}) {
    background-color: transparent;
  }
`

export const Title = styled.h4`
  font-family: Mullerbold;
  font-size: 14px;
  color: #fff;
  margin-top: 2px;
  @media screen and (max-width: ${XL}) {
    display: none;
  }
`

export const Arrow = styled.div`
  width: 10px;
  height: 10px;
  border-left: 2px solid white;
  border-bottom: 2px solid white;
  transform: rotate(-45deg);
  margin-bottom: 5px;
  @media screen and (max-width: ${BREAKPOINT}) {
    display: none;
  }
`