import styled from "styled-components";
import { BREAKPOINT } from "../../../../utils/constants";

export const Container = styled.div`
  @media screen and (max-width: ${BREAKPOINT}) {
      overflow: visible;
      height: 1000px;
  }
`

export const Title = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  text-align: center;

  h2 {
    font-family: MullerMedium;
    font-size: 48px;
    line-height: 48px;
    color: var(--black);
    margin-top: 40px;
  }

  p {
    font-size: 20px;
    line-height: 30px;
    color: var(--font);
    margin-top: 20px;
  }

  @media screen and (max-width: ${BREAKPOINT}) {
    h2 {
      margin-top: 24px;
      font-size: 22px;
      line-height: 22px;
    }

    p {
      font-size: 16px;
      line-height: 16px;
      margin-top: 20px;
    }
  }
`;

export const Grid = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  max-width: 800px;
  padding: 20px;
  margin: 60px auto;
  @media screen and (max-width: ${BREAKPOINT}) {
    flex-direction: column;
    margin: 0 auto 20px;
  }
`;

export const Box = styled.div`
  text-align: left;
  @media screen and (max-width: ${BREAKPOINT}) {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    > div {
      text-align: left;
      margin-left: 20px;
    }
  }
  svg {
    width: 40px;
    height: 40px;
  }
`;

export const GridText = styled.div`
  font-size: 14px;
  line-height: 120%;
  letter-spacing: 0.02em;
  color: var(--font);
  max-width: 200px;
  margin-top: 20px;

  a {
    text-decoration: underline;
    color: var(--red);
  }
`;

export const Disclaimer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 360px;
  text-align: center;
  color: var(--black);
  font-size: 14px;
  line-height: 18px;
  margin: 0 auto;
  p {
    margin: 15px 0;
  }
  b {
    font-family: MullerBold;
  }
`;

export const CtaWrapper = styled.div`
  button {
    padding: 12px 50px;
    margin: 40px auto;
    text-transform: uppercase;
  }
  span {
    font-size: 14px;
  }
`;

export const Footer = {
    Wrapper: styled.footer`
      display: none;
      position: fixed;
      width: 100%;
      height: 242px;
      left: 0;
      bottom: 0;
      
      background: linear-gradient(0deg, #FFFFFF 0%, rgba(255, 255, 255, 0.94) 48.91%, rgba(255, 255, 255, 0) 82.18%);
      @media screen and (max-width: ${BREAKPOINT}) {
        display: block;
      }
    `,
    Cta: styled.section`
      position: fixed;
      bottom: 40px;
      width: 100%;
      padding: 0 24px;
  
      a, button {
        width: 100%;
        font-size: 12px;
        line-height: 16px;
        text-transform: uppercase;
        height: 40px;
      }
  
    `
};

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

  p {
    padding-top: 20px;
    text-align: center;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: calc(100% + 84px);
  padding: 30px;
  margin-top: -42px;
  box-shadow: 0px 6px 74px rgba(0, 0, 0, 0.1);

  @media screen and (max-width: ${BREAKPOINT}) {
    padding: 40px 50px 15px;
  }  

  h4 {
    margin-left: auto;
    font-weight: bold;
  }  
`;

export const Icon = styled.img`
  cursor: pointer;
  margin-left: auto;
`;