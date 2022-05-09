import styled from "styled-components";
import { BREAKPOINT } from "../../../utils/constants";

export const Username = styled.div`
  color: var(--red);
  font-family: 'MontserratBold';  text-transform: uppercase;
  font-size: 20px;
  text-align: left;
  align-self: flex-start;
  margin-left: 39px;

  @media screen and (max-width: ${BREAKPOINT}) {
    margin-left: 19px;
  }
`;

export const UserPhone = styled.div`
  margin-left: 39px;
  text-align: left;
  font-family: 'MontserratMedium';  font-size: 20px;
  align-self: flex-start;
  margin-top: 13px;

  @media screen and (max-width: ${BREAKPOINT}) {
    margin-left: 19px;
  }
`;

export const CallToAction = styled.div`
  margin-top: 100px;
  display: grid;
  width: 100%;
  grid-template-columns: 176px 1fr 176px;

  @media screen and (max-width: ${BREAKPOINT}) {
    margin-top: 55px;

    grid-template-columns: 1fr;
    row-gap: 10px;
  }
`;
