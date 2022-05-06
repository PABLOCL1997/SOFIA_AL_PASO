import styled from "styled-components";
import { BREAKPOINT } from "../../../../utils/constants";

export const Title = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
  color: var(--red);
  margin-bottom: 30px;
`;

export const Form = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 24px;
  row-gap: 30px;
  @media screen and (max-width: ${BREAKPOINT}) {
    grid-template-columns: 1fr;
    column-gap: 0;
    row-gap: 12px;

    label {
      display: none;
    }
  }
`;

export const InputGroup = styled.div<{ key: string }>`
  display: flex;
  flex-direction: column;
  label {
    font-family: 'Montserrat', sans-serif;
    font-weight: 500;
    font-size: 10px;
    line-height: 10px;
    letter-spacing: 0.01em;
    text-transform: uppercase;
    color: var(--font);
    padding-left: 20px;
  }
  input {
    background: var(--whiter);
    border-radius: 44px;
    font-family: 'Montserrat', sans-serif;
    font-weight: 500;
    font-size: 14px;
    line-height: 14px;
    display: flex;
    align-items: center;
    letter-spacing: 0.01em;
    color: var(--font);
    padding: 12px 20px;
    border: 0;
    margin-top: 10px;
  }

  @media screen and (max-width: ${BREAKPOINT}) {
    input {
      margin: 0;
      height: 22px;
    }
  }
`;

export const Other = styled.button`
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 14px;
  text-decoration-line: underline;
  color: var(--red);
  border: 0;
  background: none;
  margin-top: 40px;
  &:hover {
    opacity: 0.8;
  }
`;

export const Next = {
  Wrapper: styled.div`
    display: flex;
    padding: 64px 0;
    justify-content: flex-start;
    button {
      padding: 14px 48px;
      font-size: 12px;
      font-family: 'Montserrat', sans-serif;
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
};

export const Emoji = styled.img`
  margin-left: 5px;
  width: 20px;
  vertical-align: bottom;
`;

export const Subtitle = styled.span`
  color: var(--font);
  font-weight: bold;
  margin-bottom: 30px;
`;

export const GuestTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  h2 {
    margin-bottom: 0;
    font-family: 'Montserrat', sans-serif;
    font-weight: bold;
  }
`;
