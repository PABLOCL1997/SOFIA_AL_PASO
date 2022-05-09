import styled from "styled-components";
import { BREAKPOINT } from "../../../utils/constants";

export const Wrapper = styled.div`
  background: #fbfcfc;
  box-shadow: 0px 6px 74px rgba(0, 0, 0, 0.06);
  border-radius: 8px;

  display: flex;
  align-items: center;
  padding: 22px 20px;

  // margin-top: 40px;

  img {
    margin-left: 5px;
  }
`;

export const TextWrap = styled.div`
  margin-left: 20px;
  cursor: pointer;

  p {
    font-family: 'MontserratMedium';
    color: var(--black);
    font-size: 16px;
    line-height: 24px;

    span {
      font-family: 'MontserratMedium';
      color: var(--red);
      text-decoration: underline;
    }
  }
`;

export const ActivaTitle = styled.div`
  display: flex;
  align-items: center;
  h4 {
    font-size: 16px;
    line-height: 24px;
    font-family: 'MontserratMedium';
    color: var(--red);
  }

  @media (max-width: ${BREAKPOINT}) {
    h4 {
      font-size: 14px;
      line-height: 20px;
    }
  }
`;
