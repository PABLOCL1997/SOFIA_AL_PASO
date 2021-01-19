import styled from "styled-components";
import { LargerScreens, LG } from "../../utils/constants";

export const Wrapper = styled.div`
  background: #e5e5e58f;
  height: 100vh;
  display: grid;

  @media (max-width: ${LG}) {
    height: auto;
  }
`;

export const MainContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;

  margin: -150px 0 0;

  @media (max-width: ${LG}) {
    flex-direction: column;
    justify-content: center;
    margin: 0;
    padding: 15px !important;
  }
`;

export const TextWrap = styled.div`
  max-width: 500px;

  h2 {
    font-size: 150px;
    line-height: 152px;
    color: var(--black);
    font-family: MullerBold;
  }

  @media (max-width: ${LG}) {
    max-width: unset;
    margin-top: 40px;

    h1 {
      max-width: unset;
      font-size: 110px;
      text-align: center;
    }
  }
`;

export const Headline = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  span {
    font-size: 32px;
    line-height: 32px;
    font-family: MullerMedium;
    color: var(--black);
  }

  img {
    margin-right: 20px;
  }

  @media (max-width: ${LG}) {
    img {
      margin-right: 10px;
    }

    span {
      font-size: 26px;
    }
  }
`;

export const Subtitle = styled.p`
  font-size: 16px;
  line-height: 24px;
  font-family: MullerMedium;
  color: var(--black);
`;

export const BigImg = styled.img`
  @media (min-width: ${LargerScreens}) {
    width: 550px;
  }

  @media (max-width: ${LG}) {
    width: 200px;
    margin-top: 50px;
    margin-bottom: 50px;
  }
`;

export const ButtonWrap = styled.div`
  margin: 0 0 0 auto;
  display: inline-block;

  a {
    span {
      font-size: 14px;
      line-height: 14px;

      text-transform: uppercase;
      font-family: MullerBlack;
    }
    button {
      padding: 15px 50px;
      margin-top: 80px;
    }
  }

  @media (max-width: ${LG}) {
    width: 100%;
    a {
      button {
        width: 100%;
        margin-top: 60px;
      }
    }
  }
`;
