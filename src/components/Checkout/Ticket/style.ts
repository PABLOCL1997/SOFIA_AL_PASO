import styled from "styled-components";
import { BREAKPOINT } from "../../../utils/constants";

export const Container = styled.div`
  background: white;
  border-radius: 20px;
  padding: 32px;
  max-width: 300px;
  box-shadow: 0px 12px 106px rgba(0, 0, 0, 0.12);
  position: sticky;
  top: 195px;

  @media screen and (max-width: ${BREAKPOINT}) {
    display: none;
  }
`;

export const Title = styled.h2`
  display: flex;
  margin-bottom: 24px;

  h2 {
    flex: 1;
    font-family: 'MontserratMedium';
    font-size: 24px;
    line-height: 24px;
    color: var(--red);
  }
  button {
    font-family: 'MontserratMedium';
    font-size: 16px;
    line-height: 14px;
    text-align: right;
    text-decoration-line: underline;
    color: var(--red);
    background: none;
    border: 0;
    &:hover {
      opacity: 0.8;
    }
  }
`;

export const Rows = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

export const Row = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
  span {
    font-size: 14px;
    line-height: 14px;
    color: var(--font);
    &:first-child {
      flex: 1;
      padding-right: 15px;
      line-height: 18px;
    }
  }
`;

export const Subtotal = styled.div`
  display: flex;
  margin-bottom: 20px;
  b {
    font-family: 'MontserratBold';
    font-size: 14px;
    line-height: 14px;
    color: var(--black);
    &:first-child {
      flex: 1;
      padding-right: 15px;
    }
  }
`;

export const Shipping = styled.div`
  display: flex;
  margin-bottom: 20px;
  span {
    font-size: 14px;
    line-height: 14px;
    color: var(--font);
    flex: 1;
    padding-right: 15px;
  }
  b {
    font-size: 14px;
    line-height: 14px;
    color: var(--green);
  }
`;

export const Coupon = styled.div`
  &:after {
    content: "";
    display: block;
    clear: both;
  }
  > button {
    font-family: 'MontserratMedium';
    font-size: 14px;
    line-height: 14px;
    text-align: right;
    text-decoration-line: underline;
    color: var(--red);
    background: none;
    border: 0;
    float: right;
    &:hover {
      opacity: 0.8;
    }
  }
`;

export const InputBox = styled.div`
  position: relative;
  input {
    font-family: 'MontserratRegular';
    background: var(--whiter);
    border-radius: 44px;
    border: 0;
    padding: 12px 20px;
    letter-spacing: 0.01em;
    color: var(--font);
    font-size: 14px;
    line-height: 14px;
    width: calc(100% - 40px);
  }
  button {
    background: var(--whiter);
    border: 1px solid var(--m-gray);
    box-sizing: border-box;
    font-family: 'MontserratBold';
    font-size: 12px;
    line-height: 12px;
    text-transform: uppercase;
    color: var(--font);
    padding: 12px 20px;
    border-radius: 20px;
    position: absolute;
    right: 0;
    transition: all 0.2s linear;
    &:hover {
      background: var(--m-gray);
    }
    &.add {
      background: var(--yellow);
      border: 1px solid var(--yellow);
      color: var(--black);
      &:hover {
        background: transparent;
      }
    }
  }
`;

export const Discount = styled.div`
  display: flex;
  margin: 20px 0;
  span {
    font-size: 14px;
    line-height: 14px;
    color: var(--green);
    &:first-child {
      flex: 1;
      padding-right: 15px;
    }
  }
`;

export const Line = styled.div`
  border-top: 1px solid rgba(0, 0, 0, 0.11);
  margin: 20px 0;
`;

export const Total = styled.div`
  display: flex;
  margin-bottom: 30px;
  b {
    font-family: 'MontserratMedium';
    font-size: 20px;
    line-height: 20px;
    color: var(--black);
    &:first-child {
      flex: 1;
      padding-right: 15px;
    }
  }
`;

export const CtaWrapper = styled.div`
  button {
    width: 100%;
    padding: 10px;
  }
`;

export const LoaderWrapper = styled.div`
  img {
    margin: 30px auto 0;
    display: block;
    width: 20px;
  }
`;

export const EmployeeMsg = styled.span`
  display: block;
  margin-top: -20px;
  margin-bottom: 30px;
  text-align: right;
  font-size: 12px;
  line-height: 18px;
  color: var(--red);
`;

export const ErrorText = styled.div<{ margin: boolean }>`
  font-family: 'MontserratMedium'; 
  font-size: 14px;
  line-height: 14px;
  text-decoration-line: none;
  color: var(--red);
  border: 0;
  background: none;
  margin: 20px 0 ${(props) => (props.margin ? "40px" : "0")};
  &:hover {
    opacity: 0.8;
  }
`;
