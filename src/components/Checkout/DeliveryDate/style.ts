import styled from "styled-components";

export const Title = styled.h2`
  font-family: MullerMedium;
  font-size: 16px;
  line-height: 16px;
  color: var(--red);
  margin-bottom: 30px;
`;

export const DateWrapper = styled.section`
  display: grid;
  column-gap: 24px;

  justify-content: center;
  grid-template-columns: repeat(4, 1fr);

  @media screen and (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
    row-gap: 24px;
  }
`;

export const DateSquare = styled.button<{ selected: boolean }>`
  width: 126px;
  height: 76px;

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
  margin-top: 48px;
`;

export const TimeRadio = styled.article<{ selected: boolean }>`
  padding: 8px 24px;
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
