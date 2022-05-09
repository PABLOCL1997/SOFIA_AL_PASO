import styled from "styled-components";
import { BREAKPOINT } from "../../utils/constants";

export const Page = styled.main`
  display: flex;
  width: 100%;
  justify-content: center;

  margin: 40px 0;
`;

export const ModalCourtain = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  z-index: 400;
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  &.visible {
    display: flex;
  }
`;

export const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 150px;
  img {
    width: 40px;
  }
`;

export const Modal = styled.div`
  position: relative;
  padding: 42px;
  background: white;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 380px;
  max-width: 100%;

  @media screen and (max-width: ${BREAKPOINT}) {
    min-width: 100%;
    padding: 20px;
    height: 100vh;
    border-radius: 0;
  }
`;

export const CloseWrapper = styled.div`
  cursor: pointer;
  svg {
    margin-top: 4px;
    margin-left: 30px;
    path {
      stroke: var(--red);
    }
  }
  &:hover {
    opacity: 0.8;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  width: calc(100% + 84px);
  padding: 30px;
  margin-top: -42px;
  box-shadow: 0px 6px 74px rgba(0, 0, 0, 0.1);

  @media screen and (max-width: ${BREAKPOINT}) {
    padding: 40px 50px 15px;
  }
`;

export const Title = styled.h2`
  font-family: 'MontserratMedium';
  font-size: 24px;
  line-height: 24px;
  color: var(--black);
  flex: 1;
  @media screen and (max-width: ${BREAKPOINT}) {
    font-size: 18px;

  }
`;

export const Count = styled.span`
  font-family: 'MontserratMedium';
  font-size: 16px;
  line-height: 16px;
  span {
    font-family: 'MontserratMedium';
  }
  b {
    color: var(--red);
    margin-right: 8px;
  }
`;

export const UnderBudget = styled.div`
  background: var(--red);
  width: calc(100% + 84px);
  padding: 20px;
  color: white;
  text-align: center;
  font-family: 'MontserratBold';
  text-transform: uppercase;
  font-size: 12px;
  @media screen and (max-width: ${BREAKPOINT}) {
    width: calc(100% + 40px);
    margin-top: 10px;
  }
`;

export const Items = styled.div`
  max-height: calc(100vh - 300px);
  overflow: auto;

  @media screen and (max-width: ${BREAKPOINT}) {
    width: 100%;
    padding: 0;
  }
`;

export const Totals = styled.div`
  padding: 30px 15px;
  display: flex;
  width: 100%;
`;

export const Subtotal = styled.span`
  flex: 1;
  font-family: 'MontserratMedium'; 
  font-size: 16px;
  line-height: 16px;
`;

export const Total = styled.span`
  font-family: 'MontserratMedium';
  font-size: 18px;
  line-height: 18px;
  color: var(--red);
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 15px;

  @media screen and (max-width: ${BREAKPOINT}) {
    flex-direction: column;
  }
`;
export const Disclaimer = styled.p`
  max-width: 290px;
  font-size: 11px;
  line-height: 18px;
  padding-right: 30px;

  @media screen and (max-width: ${BREAKPOINT}) {
    margin-bottom: 20px;
  }
`;

export const Toolbox = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`;

export const Empty = styled.button`
  font-family: 'MontserratMedium';
  font-size: 14px;
  line-height: 20px;
  color: var(--black);
  background: none;
  border: 0;
  &:hover {
    opacity: 0.8;
  }
`;

export const CtaWrapper = styled.div`
  margin-left: 20px;
  button {
    padding: 10px 50px;
    text-transform: uppercase;
    span {
      font-size: 14px;
    }
  }
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: 115px 1fr 95px 95px 100px 24px;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #ccc;
  width: 100%;
  @media screen and (max-width: ${BREAKPOINT}) {
    grid-template-columns: 60px 1fr 50px;
    column-gap: 7px;
  }
`;
export const Image = styled.img`
  width: 100px;
  margin-right: 20px;

  @media screen and (max-width: ${BREAKPOINT}) {
    width: 60px;
    margin: 0;
  }
`;
Image.displayName = "ProductCartImage";
export const NameBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 20px;
  flex: 1;

  @media screen and (max-width: ${BREAKPOINT}) {
    margin: 0;
  }
`;

export const Name = styled.h3`
  font-family: 'MontserratMedium';
  font-size: 14px;
  line-height: 14px;
  color: var(--black);
  margin-bottom: 5px;
  @media screen and (max-width: ${BREAKPOINT}) {
    font-size: 11px;
  }
`;
export const Units = styled.span`
  font-family: 'MontserratMedium';
  font-size: 12px;
  line-height: 12px;
  color: var(--font);
  margin-right: 20px;
`;
export const Qty = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid var(--yellow);
  padding: 10px 0;
  border-radius: 30px;
  margin-right: 20px;

  select {
    cursor: pointer;
    -webkit-appearance: none;
    background: none;
    border: 0;
    width: 65px;
    padding-left: 25px;
    font-size: 12px;
    line-height: 12px;
  }
  svg {
    pointer-events: none;
    position: absolute;
    right: 10px;
  }

  @media screen and (max-width: ${BREAKPOINT}) {
    margin-right: 0;

    select {
      padding-left: 7px;
    }
  }
`;
export const UnitPrice = styled.span`
  font-family: 'MontserratMedium';
  font-size: 12px;
  line-height: 12px;
  color: var(--font);
  margin-right: 5px;
`;

export const Price = styled.span`
  margin-right: 20px;
  font-family: 'MontserratMedium';
  font-size: 16px;
  line-height: 16px;
`;

export const DeleteWrapper = styled.div`
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  @media screen and (max-width: ${BREAKPOINT}) {
    text-align: center;
  }
`;
