import styled from "styled-components";
import { transition, LG, customStyles, XL, XXL, BREAKPOINT } from "../../../../utils/constants";

export const Wrapper = styled.div`
  padding: 20px 30px 0;

  @media (max-width: ${LG}) {
    padding: 30px 15px;
  }
  h4 {
    font-size: 20px;
    line-height: 28px;
    color: ${customStyles.red};
    font-family: "MullerMedium";
    border-bottom: 1px solid #cbcbcb;
    padding-bottom: 15px;

    @media (max-width: ${LG}) {
      border-bottom: 0;
    }
  }
`;

export const FirstList = styled.div``;

export const Paginator = styled.div`
  margin: 20px auto 0;
  text-align: center;

  ul {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;

    div {
      width: 27px;
      height: 27px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      cursor: pointer;
    }

    img {
      cursor: pointer;
    }
  }
`;

export const Li = styled.li<{ index?: number; current?: number }>`
  display: inline-block;
  margin: 0;

  font-size: 14px;
  line-height: 20px;
  color: var(--black);
  font-style: normal;
  font-weight: 500;
  background-color: ${(props) => (props.index === props.current ? "transparent" : "transparent")};
  color: ${(props) => (props.index === props.current ? customStyles.red : customStyles.black)};

  width: 27px;
  height: 27px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
`;

export const ArrowPrev = styled.img<{ disable: boolean }>`
  opacity: ${(props) => (props.disable ? "0.5" : "1")};
  transform: rotate(-180deg);
`;

export const ArrowNext = styled.img<{ disable: boolean }>`
  opacity: ${(props) => (props.disable ? "0.5" : "1")};
`;

export const Anchor = styled.div`
  position: relative;

  top: -20px;
  right: 0;
  left: 0;
`;

export const AddressRow = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--m-gray);
  padding: 15px 0;
  &:last-child {
    border-bottom: 0;
  }
`;

export const Street = styled.div`
  flex: 1;
  cursor: pointer;

  &:hover {
    color: var(--red);
  }
`;

export const StreetSpan = styled.div`
  display: flex;
  align-items: center;
  span {
    width: auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 500px;
    display: inline-block;
  }

  img {
    position: relative;
    top: -2px;
    margin-left: 5px;
  }

  @media (max-width: ${XXL}) {
    span {
      max-width: 300px;
    }
  }

  @media (max-width: ${XL}) {
    span {
      max-width: unset;
      white-space: unset;
    }
  }
`;

export const StarWrap = styled.div`
  position: relative;

  &:hover {
    > div {
      opacity: 1;
      visibility: visible;
    }
  }
`;

export const TooltipStar = styled.div`
  text-align: center;

  padding: 20px 10px;
  width: 287px;
  background: #f0f0f0;
  border-radius: 8px;
  font-size: 12px;
  line-height: 18px;

  left: 50%;
  margin-left: -141px;
  right: 0;
  top: 30px;

  color: #1a1a1a;
  position: absolute;

  transition: all ease-out 0.2s;

  opacity: 0;
  visibility: hidden;

  z-index: 2;

  &:before {
    content: "";
    width: 20px;
    height: 20px;
    background-color: #f0f0f0;
    transform: rotate(45deg);
    position: absolute;
    top: -5px;
    left: 50%;
    margin-left: -10px;
  }

  @media (max-width: ${BREAKPOINT}) {
    display: none;
  }
`;

export const DeleteWrapper = styled.div`
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

export const NewAddress = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  margin-bottom: 20px;
  padding-top: 10px;
  button {
    font-family: MullerMedium;
    font-size: 14px;
    line-height: 14px;
    text-decoration: underline;
    color: var(--red);
    background: none;
    border: 0;
    &:hover {
      opacity: 0.8;
    }
  }

  @media (max-width: ${BREAKPOINT}) {
    margin-top: 30px;
  }
`;

export const ModalCourtain = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  z-index: 10;
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 25px;
  &.visible {
    display: flex;
  }
  @media screen and (max-width: ${BREAKPOINT}) {
    padding-bottom: 0;
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
  min-width: 750px;
  max-width: 100%;
  @media screen and (max-width: ${BREAKPOINT}) {
    min-width: 100%;
    height: 100vh;
    border-radius: 0;
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
    padding: 15px 30px;
  }
`;

export const HeaderTitle = styled.h2`
  font-family: MullerMedium;
  font-size: 24px;
  line-height: 24px;
  color: var(--black);
  flex: 1;
  @media screen and (max-width: ${BREAKPOINT}) {
    font-size: 14px;
    line-height: 14px;
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

export const ModalContainer = styled.div`
  padding: 30px 0;
  width: 100%;
  max-height: calc(100vh - 300px);
  overflow: auto;
  @media screen and (max-width: ${BREAKPOINT}) {
    max-height: calc(100vh - 100px);
  }
`;

export const CtaWrapper = styled.div`
  button {
    padding: 10px 50px;
    margin-top: 30px;
  }
  img {
    margin: 30px auto 0;
    display: block;
  }
`;

export const LoaderWrapper = styled.div`
  img {
    width: 20px;
  }
`;

export const InputGroup = styled.div<{ key: string; withLabel: boolean }>`
  display: flex;
  flex-direction: column;
  label {
    font-family: MullerMedium;
    font-size: 10px;
    line-height: 10px;
    letter-spacing: 0.01em;
    text-transform: uppercase;
    color: var(--font);
    padding-left: 20px;
    opacity: ${(props) => (props.withLabel ? "1" : "0")};
  }
  input {
    background: var(--whiter);
    border-radius: 44px;
    font-family: MullerMedium;
    font-size: 14px;
    line-height: 14px;
    display: flex;
    align-items: center;
    letter-spacing: 0.01em;
    color: var(--font);
    padding: 12px 20px;
    border: 0;
    margin-top: 10px;
    &.error {
      border: 1px solid var(--red);
    }
  }
`;

export const SelectWrapper = styled.div`
  position: relative;
  cursor: pointer;

  select {
    -webkit-appearance: none;
    width: 100%;
    background: var(--whiter);
    border-radius: 44px;
    font-family: MullerMedium;
    font-size: 14px;
    line-height: 14px;
    display: flex;
    align-items: center;
    letter-spacing: 0.01em;
    color: var(--font);
    padding: 10px 20px;
    border: 0;
    margin-top: 10px;
    cursor: pointer;
  }

  svg {
    pointer-events: none;
    position: absolute;
    top: 24px;
    right: 20px;
    path {
      stroke: var(--red);
    }
  }
`;

export const Form = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 24px;
  row-gap: 30px;
  @media screen and (max-width: ${BREAKPOINT}) {
    grid-template-columns: 1fr;
    column-gap: 0;
  }
`;
