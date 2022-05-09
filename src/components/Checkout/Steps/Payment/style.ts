import styled from "styled-components";
import { BREAKPOINT } from "../../../../utils/constants";

export const Container = styled.div`
  @media screen and (max-width: ${BREAKPOINT}) {
    .switchContainer > div {
      > div {
        font-size: 10px;
      }
    }
  }
`;

export const Title = styled.h2`
  font-family: 'MontserratMedium';
  font-size: 16px;
  line-height: 16px;
  color: var(--red);
  margin-bottom: 30px;
  img {
    display: none;
    position: absolute;
    cursor: pointer;
  }
  h2 {
    font-family: 'MontserratMedium';
    font-size: 16px;
    line-height: 16px;
    color: var(--red);
    flex: 1;
  }
  @media screen and (max-width: ${BREAKPOINT}) {
    flex-direction: column;
    h2 {
      padding-left: 42px;
    }
    span {
      margin-top: 10px;
    }
    img {
      display: block;
    }
  }
`;

export const Disclaimer = styled.div`
  font-family: 'MontserratMedium'; 
  font-size: 12px;
  line-height: 12px;
  letter-spacing: 0.01em;
  color: var(--black);
  margin-top: 20px;
`;

export const red: React.CSSProperties = {
    color: "red",
};

export const green: React.CSSProperties = {
    color: "green",
};

export const Next = {
    Wrapper: styled.div`
      display: flex;
      padding: 64px 0;
      justify-content: flex-start;
      button {
        padding: 14px 48px;
        font-size: 12px;
        font-family: 'MontserratBold';
        text-transform: uppercase;
        line-height: 20px;
      }

      @media screen and (max-width: ${BREAKPOINT}) {
        display: block;
        button {
          width: 100%;
        }
      }
    `,
  }
    

  export const Back = {
    Wrapper: styled.div`
      margin-bottom: 32px;
      @media screen and (max-width: ${BREAKPOINT}) {
        display: none;
      }
    `,
  }

  export const Footer = {
    Wrapper: styled.footer`
      display: none;
      margin-top: 50px;
      width: 100%;
  
      background: linear-gradient(0deg, #ffffff 0%, rgba(255, 255, 255, 0.94) 48.91%, rgba(255, 255, 255, 0) 82.18%);
      @media screen and (max-width: ${BREAKPOINT}) {
        display: block;
      }
    `,
    Total: styled.section`
      display: flex;
      padding: 0 24px;
      justify-content: space-between;
      bottom: 78px;
      width: 100%;
  
      font-size: 14px;
      line-height: 20px;
      font-style: normal;
      em {
        font-family: 'MontserratMedium';
      }
      strong {
        font-family: 'MontserratBold';
      }
    `,
    Cta: styled.section`
      padding: 0 24px;
      bottom: 28px;
      width: 100%;
  
      a,
      button {
        width: 100%;
        font-size: 12px;
        line-height: 16px;
        text-transform: uppercase;
        height: 40px;
      }
    `,
  };