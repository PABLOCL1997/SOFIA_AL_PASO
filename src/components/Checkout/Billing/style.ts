import styled from "styled-components";
import { BREAKPOINT } from "../../../utils/constants";

export const Title = styled.h2`
  font-family: MullerMedium;
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
  }
`;

export const InputGroup = styled.div<{ key: string }>`
  display: flex;
  flex-direction: column;
  label {
    font-family: MullerMedium;
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
    font-family: MullerMedium;
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
`;

export const Other = styled.button`
  font-family: MullerMedium;
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
