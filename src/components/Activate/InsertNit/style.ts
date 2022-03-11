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
  margin-bottom: 10px;  
`;

export const CallToAction = styled.div`
  display: grid;
  width: 100%;
  margin-top: auto;
  grid-template-columns: 176px 1fr;

  @media screen and (max-width: ${BREAKPOINT}) {
    grid-template-columns: 1fr;
  }
`;

export const LogoWhatsApp = {
  Wrapper: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    background-color: #4cca5a;
    font-weight: bold;
    width: 220px;
    border-radius: 100px;
    padding: 5px;
    margin-top: 20px;
    margin-bottom: 50px;
    &:hover {
      cursor: pointer;
    }
  `,
  Img: styled.img`
    width: 30px;
  `,
  Title: styled.h4`
    word-break: break-word;
    width: 120px;
    text-align: center;
    color: white;
  `
}

