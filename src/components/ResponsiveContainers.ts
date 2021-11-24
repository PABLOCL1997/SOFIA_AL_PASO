import styled from "styled-components";
import { BREAKPOINT, LG } from "../utils/constants";

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

export const DesktopAndTablet = styled.div`
  display: block;
  @media screen and (max-width: ${LG}) {
    display: none;
  }
`;

export const MobileAndTablet = styled.div`
  display: none;
  width: 100%;
  @media screen and (max-width: ${LG}) {
    display: block;
  }
`;
