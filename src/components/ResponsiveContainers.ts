import styled from "styled-components";
import { BREAKPOINT } from "../utils/constants";

export const Desktop = styled.div`
  display: block;
  @media screen and (max-width: ${BREAKPOINT}) {
    display: none;
  }
`;

export const Mobile = styled.div`
  display: none;
  width: 100%;
  @media screen and (max-width: ${BREAKPOINT}) {
    display: block;
  }
`;
