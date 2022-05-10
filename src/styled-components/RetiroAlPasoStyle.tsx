import styled from "styled-components";
import bg from "../assets/retiro-al-paso-images/header.jpg";

import { BREAKPOINT } from "../utils/constants";

export const Wrapper = styled.div``;

export const Header = styled.div`
  display: flex;
  height: 190px;
  margin-top: -40px;
  background: url(${bg}) no-repeat center center / cover;

  h1 {
    font-size: 32px;
    line-height: 40px;
    color: var(--black);
    font-family: 'MontserratMedium';
    margin-left: 20px;
    padding-top: 5px;
  }

  div {
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 1050px;
    margin: 0 auto;
    padding: 0 40px;
  }

  @media (max-width: ${BREAKPOINT}) {
    margin-top: 0;
    background: url(${bg}) no-repeat 40% center / cover;
    height: 150px;

    div {
      justify-content: center;

      h1 {
        font-size: 26px;
      }
    }
  }
`;

export const StepsWrap = styled.div`
  padding: 200px 0;

  @media (max-width: ${BREAKPOINT}) {
    display: none;
  }
`;

export const NumberIcon = styled.div`
  width: 56px;
  height: 56px;
  border: 2px solid var(--red);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin: 0 auto;
  position: relative;

  span {
    font-size: 20px;
    line-height: 28px;
    color: var(--red);
  }

  &:after {
    content: "";
    width: 1px;
    height: 198px;
    background-color: var(--m-gray);
    position: absolute;
    top: 90px;
    left: 50%;
    transform: translate(-50%, 0);
  }

  @media (max-width: ${BREAKPOINT}) {
    margin-bottom: 80px;
    &:after {
      top: 75px;
      height: 40px;
    }
  }
`;

export const Step = styled.div`
  display: grid;
  grid-template-columns: 1fr 0.5fr 1fr;
  max-width: 1440px;
  margin: -70px auto 0;
  padding: 0 20px 220px;

  align-items: baseline;
  text-align: center;

  &.step-3 {
    margin-top: -90px;
  }
  &.step-5 {
    margin-top: -50px;
  }

  &:last-of-type {
    ${NumberIcon} {
      &:after {
        display: none;
      }
    }
  }
`;

export const Columns = styled.div<{ align?: string }>`
  text-align: ${(props) => (props.align ? props.align : "center")};
`;

export const TextContainer = styled.div<{ align?: string }>`
  width: 55%;
  margin: ${(props) => (props.align == "right" ? "0 0 0 auto;" : props.align == "left" ? "0 auto 0 0;" : "0 auto;")};
  text-align: left;
`;

export const Text = styled.p<{ align?: string; maxWidth?: string }>`
  font-size: 20px;
  line-height: 28px;
  color: #000000;
  font-family: 'MontserratMedium';
  max-width: ${(props) => (props.maxWidth ? props.maxWidth : "unset")};

  @media (max-width: ${BREAKPOINT}) {
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 15px;
    font-size: 17px;
    text-align: center;
  }
`;

export const SubText = styled.div<{ marginTop?: string }>`
  font-size: 15px;
  line-height: normal;
  font-family: 'MontserratMedium';  margin-top: ${(props) => (props.marginTop ? props.marginTop : "40px")};

  @media (max-width: ${BREAKPOINT}) {
    text-align: center;
  }
`;

export const RetireAlPasoDiv = styled.div`
  height: 45px;

  div {
    height: 100%;
    button {
      height: 100%;
    }
  }
`;

export const Image = styled.img<{ maxWidth?: string }>`
  max-width: ${(props) => (props.maxWidth ? props.maxWidth : "auto")};
  width: 100%;

  &.img-3 {
    position: relative;
    top: 45px;
    left: -20px;
  }
  &.img-4 {
    position: relative;
    top: 10px;
  }
  &.img-5 {
    position: relative;
    top: 10px;
    left: -20px;
  }
`;

export const BottomText = styled.h3`
  font-size: 24px;
  line-height: 32px;
  color: #000000;
  font-family: 'MontserratMedium';
  text-align: center;
  margin-top: -50px;

  @media (max-width: ${BREAKPOINT}) {
    margin-top: 40px;
    font-size: 20px;
    margin-bottom: 50px;
  }
`;

export const StepMobileWrap = styled.div`
  padding: 50px 0;
  display: none;

  @media (max-width: ${BREAKPOINT}) {
    display: block;
  }
`;

export const MobileStep = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0;
`;
