import styled from "styled-components";
import { BREAKPOINT } from "../../../utils/constants";

export const CallToAction = styled.div`
  margin-top: 100px;
  display: grid;
  width: 100%;
  grid-template-columns: 176px 1fr 176px;
`;

export const Actions = {
  Wrapper: styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 32px;
    margin: 36.33px 0;

    @media screen and (max-width: ${BREAKPOINT}) {
      grid-template-columns: 1fr;
      row-gap: 26px;
    }
  `,
  Action: styled.div`
    display: flex;
    flex-direction: column;
  `,
  Info: styled.p`
    text-align: center;
    margin-bottom: 36px;

    strong {
      font-weight: bold;
    }
    @media screen and (max-width: ${BREAKPOINT}) {
      order: 2;
      font-size: 12px;
      text-align: left;
      margin-top: 10px;
      margin-bottom: 20px;
    }
  `,
  Icon: {
    Wrapper: styled.div`
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      height: 149px;
      margin-bottom: 30px;

      @media screen and (max-width: ${BREAKPOINT}) {
        order: 1;
        height: auto;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        column-gap: 13px;
        margin-bottom: 0;

        svg {
          height: auto;
          width: 49px;
        }
      }
    `,
  },
  Label: {
    Wrapper: styled.div`
      display: flex;
      height: 40px;

      @media screen and (max-width: ${BREAKPOINT}) {
        align-items: center;
      }
    `,
    Label: styled.label`
      display: flex;
      text-align: center;
      align-items: flex-start;
      font-family: 'MontserratMedium';      font-size: 16px;
    `,
  },
  Button: {
    Wrapper: styled.div`
      @media screen and (max-width: ${BREAKPOINT}) {
        order: 3;
      }
    `,
  },
};
