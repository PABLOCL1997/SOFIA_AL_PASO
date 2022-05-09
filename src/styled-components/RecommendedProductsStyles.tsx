import styled from "styled-components";
import { BREAKPOINT, LG } from "../utils/constants";

const ModalCourtain = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  z-index: 4;
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  &.visible {
    display: flex;
  }

  @media screen and (max-width: ${BREAKPOINT}) {
    margin-top: 100px;
  }
`;

const Modal = styled.div`
  position: relative;
  padding: 42px;
  background: white;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 380px;
  max-width: 100%;

  @media screen and (max-width: ${LG}) and (min-width: 769px) {
    margin-top: 100px;
  }

  @media screen and (max-width: ${BREAKPOINT}) {
    min-width: 100%;
    padding: 20px;
    height: 100vh;
    border-radius: 0;
  }
`;

const CloseWrapper = styled.div`
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
const QtyInput = styled.input``;
const Qty = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid var(--yellow);
  padding: 10px 0;
  border-radius: 30px;
  margin-right: 20px;
  @media screen and (max-width: ${BREAKPOINT}) {
    margin-right: 0;
  }
  input {
    -webkit-appearance: none;
    background: none;
    border: 0;
    width: 65px;
    padding-left: 30px;
    font-size: 12px;
    line-height: 12px;
  }
  svg:first-child {
    position: absolute;
    cursor: pointer;
    left: 10px;
  }
  svg:last-child {
    position: absolute;
    cursor: pointer;
    right: 10px;
    transform: rotate(180deg);
  }
`;

const Header = styled.div`
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

const Title = styled.h2`
  font-family: 'MontserratMedium';  font-size: 24px;
  line-height: 24px;
  color: var(--black);
  flex: 1;
`;

const Count = styled.span`
  font-family: 'MontserratMedium';  font-size: 16px;
  line-height: 16px;
  span {
    font-family: 'MontserratMedium';
  }
  b {
    color: var(--red);
    margin-right: 8px;
  }
`;

const UnderBudget = styled.div`
  background: var(--red);
  width: calc(100% + 84px);
  padding: 20px;
  color: white;
  text-align: center;
  font-family: 'MontserratBold';  text-transform: uppercase;
  font-size: 12px;
  @media screen and (max-width: ${BREAKPOINT}) {
    width: calc(100% + 40px);
    margin-top: 20px;
  }
`;

const Items = styled.div`
  max-height: calc(100vh - 300px);
  overflow: auto;

  @media screen and (max-width: ${BREAKPOINT}) {
    width: 100%;
    max-width: calc(100% - 40px);
    max-height: calc(100vh - 320px);
    height: calc(100vh - 320px);
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 115px 1fr 95px 95px 100px 24px;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #ccc;
  width: 100%;
  @media screen and (max-width: ${BREAKPOINT}) {
    grid-template-columns: 115px 1fr 70px;
  }
`;

const Image = styled.img`
  width: 100px;
  margin-right: 20px;
`;

const NameBox = styled.div`
  display: grid;
  grid-template-columns: 10fr 2fr;
  margin-right: 20px;
  align-items: center;
  column-gap: 10px;
  @media screen and (max-width: ${BREAKPOINT}) {
    grid-template-columns: 1fr;
  }
`;

const Name = styled.h3`
  font-family: 'MontserratMedium';  font-size: 14px;
  line-height: 14px;
  color: var(--black);
`;

const Units = styled.span`
  font-family: 'MontserratMedium';  font-size: 12px;
  line-height: 12px;
  color: var(--font);
  margin-right: 20px;
`;

const UnitPrice = styled.span`
  font-family: 'MontserratMedium';  font-size: 12px;
  line-height: 12px;
  color: var(--font);
  margin-right: 5px;
`;

const Price = styled.span`
  margin-right: 20px;
  font-family: 'MontserratMedium';  font-size: 16px;
  line-height: 16px;
`;

const DeleteWrapper = styled.div`
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  @media screen and (max-width: ${BREAKPOINT}) {
    text-align: center;
  }
`;

const Totals = styled.div`
  padding: 30px 15px;
  display: flex;
  width: 100%;
`;

const Subtotal = styled.span`
  flex: 1;
  font-family: 'MontserratMedium';  font-size: 16px;
  line-height: 16px;
`;

const Total = styled.span`
  font-family: 'MontserratMedium';  font-size: 18px;
  line-height: 18px;
  color: var(--red);
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 15px;

  @media screen and (max-width: ${BREAKPOINT}) {
    position: fixed;
    bottom: 30px;
    flex-direction: column;
  }
`;
const Disclaimer = styled.p`
  max-width: 290px;
  font-size: 11px;
  line-height: 18px;
  padding-right: 30px;

  @media screen and (max-width: ${BREAKPOINT}) {
    margin-bottom: 20px;
  }
`;

const Toolbox = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`;

const Empty = styled.button`
  font-family: 'MontserratMedium';  font-size: 14px;
  line-height: 20px;
  color: var(--black);
  background: none;
  border: 0;
  &:hover {
    opacity: 0.8;
  }
`;

const CtaWrapper = styled.div`
  margin-left: 20px;
  button {
    padding: 10px 50px;
    text-transform: uppercase;
    span {
      font-size: 14px;
    }
  }
`;

const DeliveryTimeIcon = styled.div`
  box-shadow: 0 5px 20px var(--l-yellow);
  background: var(--yellow);
  color: var(--black);
  padding: 10px;
  border-radius: 20px;
  border: 0;
  width: 40px;
  height: 40px;
  img {
    width: 20px;
    height: 20px;
  }
  @media screen and (max-width: ${BREAKPOINT}) {
    display: none;
  }
`;

const DiscountPercentIcon = styled.div`
  box-shadow: 0 5px 20px var(--l-yellow);
  background: var(--yellow);
  color: var(--black);
  padding: 10px;
  border-radius: 15px;
  border: 0;
  width: 25px;
  height: 25px;
  img {
    width: 15px;
    height: 14px;
    position: relative;
    top: -6px;
    left: -5px;
  }
  @media screen and (max-width: ${BREAKPOINT}) {
    display: none;
  }
`;

const DiscountLabel = styled.div`
  color: red;
  margin-top: 10px;
`;

export {
  ModalCourtain,
  Modal,
  CloseWrapper,
  Qty,
  Header,
  Title,
  Count,
  UnderBudget,
  Items,
  Row,
  Image,
  NameBox,
  Name,
  Units,
  UnitPrice,
  Price,
  DeleteWrapper,
  Totals,
  Subtotal,
  Total,
  Footer,
  Disclaimer,
  Toolbox,
  Empty,
  CtaWrapper,
  QtyInput,
  DeliveryTimeIcon,
  DiscountPercentIcon,
  DiscountLabel,
};
