import styled from "styled-components";
import { BREAKPOINT } from "../../../../utils/constants";

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

export const DateWrapper = styled.section`
  display: grid;
  column-gap: 24px;

  justify-content: center;
  max-width: 800px;

  .slick-list {
    max-width: 450px;
  }

  @media (max-width: ${BREAKPOINT}) {
    .slick-list {
      max-width: 280px;
    }
  }
`;

export const DateSquare = styled.button<{ selected: boolean }>`
  width: 126px !important;
  height: 76px !important;

  background: #ffffff;

  box-sizing: border-box;
  box-shadow: 0px 17px 32px rgba(107, 107, 107, 0.1);
  border-radius: 8px;

  padding-top: 18px;
  padding-bottom: 18px;

  ${({ selected }) =>
    selected &&
    `
        border: 2px solid #E30613;    
    `}

  @media screen and (max-width: 600px) {
    margin: 0 auto;
  }
`;

export const Date = styled.p`
  font-size: 12px;
  margin-bottom: 4px;
`;
export const Day = styled.strong`
  font-family: MullerMedium;
  font-size: 16px;
`;

export const TimeWrapper = styled.section`
  display: flex;
  justify-content: center;
  column-gap: 24px;
  row-gap: 10px;
  margin-top: 48px;

  @media screen and (max-width: ${BREAKPOINT}) {
    flex-direction: column;
  }
`;

export const TimeRadio = styled.article<{ selected: boolean }>`
  padding: 8px 16px;
  color: var(--black);
  box-sizing: border-box;
  border-radius: 200px;

  input {
    color: red;
  }

  ${({ selected }) =>
    selected &&
    `
        border: 1px solid var(--red);
        color: var(--red);
    `}
`;

export const Radio = styled.input`
  cursor: pointer;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 100%;
  border: 1px solid var(--red);
  margin: 0 8px -3px 0;

  &:checked {
    background: var(--red);
    box-shadow: 0 0 0 3px white inset;
  }
`;
export const Time = styled.label`
  font-size: 14px;
`;


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
      padding: 32px 0;
      
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