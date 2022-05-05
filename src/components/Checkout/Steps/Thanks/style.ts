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

export const GuestDescription = styled.p`
  max-width: 600px;
  font-size: 16px !important;
  line-height: 18px !important;
`;