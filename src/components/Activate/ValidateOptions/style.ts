import styled from "styled-components";
import { BREAKPOINT } from "../../../utils/constants";

export const Input = styled.input`
  width: calc(100% - 48px);
  background: #f0f0f0;
  border-radius: 48px;
  padding: 12px 24px;
  font-size: 14px;
  font-family: MullerMedium;
  border: none;
  margin-bottom: 30px;  
`;

export const CallToAction = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  width: 100%;    
  margin-top: auto;
  @media screen and (max-width: ${BREAKPOINT}) {
    margin-top: unset;
  }
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  width: 100%;
  margin-top: 40px;
`

export const Message = styled.h4`
  color: #606060;
  font-family: MullerMedium;
  font-size: 20px;
`

export const Break = {
  Wrapper: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 30px;
    width: 100%;
  `,
  Line: styled.div`
    width: 100%;
    height: 1px;
    background-color: #606060;
  `,
  Title: styled.h4`
    width: 30px;
    font-family: MullerMedium;
    font-size: 18px;
    text-transform: uppercase;
    color: #606060;
  `
}

export const User = {
  Wrapper: styled.div`
    display: flex;
    width: 100%;
    gap: 20px;
  `,
  Phone: styled.div`
    text-align: left;
    font-family: MullerMedium;
    font-size: 20px;
    align-self: flex-start;    
  `,
  Name: styled.div`
    color: var(--red);
    font-family: MullerBold;
    text-transform: uppercase;
    font-size: 20px;
    text-align: left;
    align-self: flex-start;
  `,
  Send: styled.button`
    background-color: transparent;
    border: none;
    color: var(--red);
    font-family: MullerBold;
    text-transform: uppercase;
    font-size: 16px;
    font-weight: bold;
  `
}