import styled from "styled-components";
import { BREAKPOINT } from "../../../utils/constants";

export const CallToAction = styled.div`
  margin-top: 32px;
  display: grid;
  justify-content: center;
  width: 100%;
  column-gap: 37px;
  grid-template-columns: 176px 176px;

  @media screen and (max-width: ${BREAKPOINT}) {
    margin-top: 22px;

    grid-template-columns: 1fr;
    row-gap: 10px;
  }
`;

export const Timer = {
  Wrapper: styled.div`
    margin-top: -20px;
  `,
  Time: styled.strong`
    font-size: 14px;
    font-weight: bold;
  `,
};

export const Resend = {
  Wrapper: styled.div``,
  Link: styled.a`
    text-decoration: underline;
    font-weight: bold;
    color: var(--red);
  `,
};

export const Help = {
  Wrapper: styled.div`
    display: grid;
    column-gap: 9px;
    grid-template-columns: 14px 1fr;
    margin-top: 22px;
  `,
  Text: styled.p`
    width: 312px;
    font-size: 12px;
    a {
      font-weight: bold;
      text-decoration: underline;
    }
  `,
};

export const Inputs = {
  Wrapper: styled.div`
    display: grid;
    grid-template-columns: repeat(6, 35px);
    max-width: 300px;
    justify-content: center;
    // grid-gap: 0 10px;
    column-gap: 30px;
    margin-top: 14px;
    margin-bottom: 23px;

    input {
      padding: 0;
      text-align: center;

      font-family: MullerMedium;

      font-weight: 500;
      font-size: 50px;
      line-height: 40px;
      border: none;
      width: 54px;
      height: 69px;

      background: #f0f0f0;
      border-radius: 10px;

      @media screen and (max-width: ${BREAKPOINT}) {
        font-size: 40px;

        width: 39.68px;
        height: 50px;
      }
    }

    @media screen and (max-width: ${BREAKPOINT}) {
      column-gap: 9px;
    }
  `,
  Input: styled.input``,
};
