import styled from "styled-components";
import { BREAKPOINT, XL } from "../../../utils/constants";

export const Wrapper = styled.div<{ showPromoBar: boolean }>`
  position: fixed;
  display: ${(props) => props.showPromoBar ? "flex" : "none" };
  justify-content: center;
  align-items: center;
  background-color: var(--red);
  width: 100%;
  height: 32px;
  z-index: 12;
  top: 0;
  border-bottom: 2px solid #fff;
  box-shadow: rgba(0, 0, 0, 0.33) 0px 6px 15px 0px;
  @media screen and (max-width: ${XL}) {
    gap: 20px;
  }
`;

export const Title = styled.h4`
  font-size: 15px;
  color: #fff;
  font-family: MullerBold;
  margin-left: auto;
  @media screen and (max-width: ${BREAKPOINT}) {
    display: none;
  }
`

export const Buy = {
  Button: styled.button`
    position: absolute;
    left: 70%;
    border: none;
    background-color: var(--yellow);
    border-radius: 20px;
    width: 150px;    
    @media screen and (max-width: ${XL}) {
      position: relative;
      left: unset;
    }
    @media screen and (max-width: ${BREAKPOINT}) {
      width: max-content;
    }
  `,
  TitleDesktop: styled.h4`
    font-size: 15px;
    font-family: MullerRegular;
    @media screen and (max-width: ${BREAKPOINT}) {
      display: none;
    }
  `,
  TitleMobile: styled.h4`
    font-size: 15px;
    font-family: MullerRegular;
    @media screen and (min-width: ${BREAKPOINT}) {
      display: none;
    }
  `,
}


export const Close = styled.div`
  margin-left: auto;
  margin-right: 10px;
  &:hover {
    cursor: pointer;
  }
  @media screen and (max-width: ${BREAKPOINT}) {
    margin-left: 90%;
    position: absolute;
  }
`