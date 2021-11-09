import styled from "styled-components";
import { BREAKPOINT } from "../../../utils/constants";

export const Input = styled.input`
  width: calc(100% - 48px);
  background: #f0f0f0;
  border-radius: 48px;
  padding: 12px 24px;
  font-size: 14px;
  font-family: MullerMedium;
  border: none;

  margin-bottom: 122px;

  @media screen and (max-width: ${BREAKPOINT}) {
    margin-bottom: 82px;
  }
`;

export const CallToAction = styled.div`
  display: grid;
  width: 100%;

  grid-template-columns: 176px 1fr;

  @media screen and (max-width: ${BREAKPOINT}) {
    grid-template-columns: 1fr;
  }
`;
