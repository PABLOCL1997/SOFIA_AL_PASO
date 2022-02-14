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
  font-family: MullerMedium;
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
    font-family: MullerMedium;
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
  font-family: MullerMedium;
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
        font-family: MullerMedium;
        font-weight: bold;
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