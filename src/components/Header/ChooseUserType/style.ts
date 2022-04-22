import styled from "styled-components";
import { BREAKPOINT } from "../../../utils/constants";

export const ModalCourtain = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  z-index: 300;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;  
`;

export const Modal = styled.div`
  position: relative;
  padding: 42px;
  background: white;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 380px;
  max-width: 100%;

  @media screen and (max-width: ${BREAKPOINT}) {
    min-width: 100%;
    padding: 20px;
    height: 100vh;
    border-radius: 0;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  width: calc(100% + 84px);
  padding: 30px;
  margin-top: -42px;
  box-shadow: 0px 6px 74px rgba(0, 0, 0, 0.1);

  @media screen and (max-width: ${BREAKPOINT}) {
    padding: 40px 50px 15px;
  }
`;

export const Title = styled.h2`
  font-family: MullerMedium;
  font-size: 24px;
  line-height: 24px;
  color: var(--black);
  flex: 1;
  text-align: center;
  @media screen and (max-width: ${BREAKPOINT}) {
    font-size: 18px;

  }
`;

export const CtaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 20px 50px;
  box-sizing: border-box;  
  button {
    width: 300px;
    height: 50px;
  }
`;

export const BuyIcon = styled.img`
  margin-top: 30px;
  width: 100px;
`;

export const Icon = styled.img`
  cursor: pointer;
`;