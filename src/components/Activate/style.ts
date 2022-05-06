import styled from "styled-components";
import { BREAKPOINT } from "../../utils/constants";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  margin-bottom: 35px;

  @media screen and (max-width: ${BREAKPOINT}) {
    padding: 0 24px;
  }
`;

export const Square = styled.section`
  display: flex;
  width: 601px;
  min-height: 524px;
  flex-direction: column;
  box-shadow: 0px 6px 74px rgba(0, 0, 0, 0.09);
  border-radius: 20px;
  align-items: center;
  padding: 55px 100px 74px 80px;

  @media screen and (max-width: ${BREAKPOINT}) {
    padding: 0;
    width: 100%;
    min-height: none;
    box-shadow: none;
  }
`;

export const ButtonPrimary = styled.button`
  width: 100%;
  font-size: 12px;
  font-family: 'Montserrat', sans-serif;
  font-weight: bold;
  text-transform: uppercase;
  /* Rojo Sofía */
  background: var(--red);
  color: white;
  border: none;
  border-radius: 44px;
  padding: 15px 0;

  &:disabled {
    opacity: 0.5;
  }
`;

export const ButtonSecondary = styled.button`
  width: 100%;
  font-size: 12px;
  font-family: 'Montserrat', sans-serif;
  font-weight: bold;

  text-transform: uppercase;
  background: #ffffff;
  border: 2px solid var(--red);
  color: var(--red);
  box-sizing: border-box;
  border-radius: 44px;
  padding: 15px 0;

  &:disabled {
    opacity: 0.5;
  }
`;

export const ButtonSecondaryLarge = styled.button`
  width: 100%;
  font-size: 12px;
  font-family: 'Montserrat', sans-serif;
  font-weight: bold;

  text-transform: uppercase;
  background: #ffffff;
  border: 2px solid var(--red);
  color: var(--red);
  box-sizing: border-box;
  border-radius: 44px;
  padding: 15px 0;

  &:disabled {
    opacity: 0.5;
  }
`;

export const Title = styled.h2`
  font-size: 32px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  line-height: 40px;
  margin: 26px;

  @media screen and (max-width: ${BREAKPOINT}) {
    font-size: 18px;
    margin-top: 15px;
    margin-bottom: 16px;
  }
`;

export const Instructions = {
  Wrapper: styled.div`
    background: #fff5cc;
    border-radius: 20px;
    border: none;
    padding: 10px 39px 10px 25px;

    min-height: 116px;
    color: var(--black);

    display: flex;
    justify-content: center;
    align-items: center;

    margin-top: 37px;
    margin-bottom: 29px;

    @media screen and (max-width: ${BREAKPOINT}) {
      padding: 0;
      background: none;
      font-size: 14px;
      min-height: 0;

      margin-top: 37px;
      margin-bottom: 39px;
    }
  `,
  Title: styled.strong`
    opacity: 1;
    color: var(--black);

    strong {
      font-weight: bold;
    }
  `,
};

export const ProgressBar = {
  Wrapper: styled.div`
    svg {
      width: 361px;
    }

    @media screen and (max-width: ${BREAKPOINT}) {
      svg {
        width: 265px;
      }
    }
  `,
};

export const Error = styled.div`
  justify-self: start;
  color: var(--red);
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  margin-bottom: 5px;
  padding-left: 15px;
  font-size: 12px;
  text-align: left;
  width: 100%;
`;
