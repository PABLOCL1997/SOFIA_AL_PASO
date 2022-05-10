import styled from "styled-components";
import { BREAKPOINT } from "../../../utils/constants";

export const BenefitList = {
  Wrapper: styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;

    margin-bottom: 47px;

    @media screen and (max-width: ${BREAKPOINT}) {
      margin-bottom: 25px;
    }
  `,
  Item: {
    Wrapper: styled.div`
      display: flex;
      flex-direction: column;
      row-gap: 13px;
      width: 100%;
      justify-content: center;
      align-items: center;

      @media screen and (max-width: ${BREAKPOINT}) {
        row-gap: 4px;
        svg {
          width: 53px;
          height: 53px;
        }
      }
    `,
    Title: styled.strong`
      font-family: 'MontserratMedium';
      font-size: 16px;
      line-height: 20px;
      @media screen and (max-width: ${BREAKPOINT}) {
        font-size: 12px;
      }
    `,
  },
};

export const Text = styled.p`
  max-width: 360px;
  max-height: 71px;

  margin-bottom: 73px;
  strong {
    font-weight: bold;
  }

  @media screen and (max-width: ${BREAKPOINT}) {
    margin-bottom: 35px;
    font-size: 14px;
    width: 252px;
  }
`;

export const CallToAction = styled.div`
  display: grid;
  grid-template-columns: 176px 32px 1fr;

  @media screen and (max-width: ${BREAKPOINT}) {
    grid-template-columns: 32px 1fr;
    row-gap: 32px;
    button {
      grid-column: 1/3;
    }
  }
`;

export const InfoWrapper = styled.div`
  margin: 0 16px 0 8px;
`;

export const Info = styled.b`
  a {
    font-weight: bold;
    text-decoration: underline;
  }

  @media screen and (max-width: ${BREAKPOINT}) {
    font-size: 12px;
    width: 220px;
  }
`;
