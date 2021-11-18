import styled from "styled-components";
import { BREAKPOINT, XL, customStyles } from "../utils/constants";
import BuscarIcon from "../assets/images/buscar-zoom.svg";
import BuscarIconRed from "../assets/images/buscar-zoom-red.svg";

export const IngresarWrap = styled.div<{ action?: any; hideOnBreakpoint?: boolean }>`
  cursor: pointer;

  @media screen and (max-width: ${XL}) {
    display: flex;
    justify-content: center;
  }

  @media screen and (max-width: ${BREAKPOINT}) {
    display: ${({ hideOnBreakpoint }) => (hideOnBreakpoint ? "none !important" : "unset")};
  }
`;

export const IngresarImg = styled.img`
  margin-right: 5px;
`;

export const IngresarText = styled.span`
  font-size: 14px;
  line-height: 20px;
  color: ${customStyles.red};
  font-family: MullerMedium;

  @media screen and (max-width: ${XL}) {
    display: none;
  }
`;

export const RightMenu = styled.div`
  display: flex;
  align-items: center;

  > div {
    margin-left: 15px;
    margin-bottom: 0;

    svg {
      width: 20px;
      position: relative;
      top: 3px;
    }
  }
`;

export const Wrapper = styled.div``;

export const Fixed = styled.div<{ shadow: boolean }>`
  width: 100%;
  margin: 0 auto;
  padding: 0 20px;
  position: fixed;
  background: white;
  left: 0;
  top: 0;
  z-index: 11;
  box-shadow: ${(props) => (props.shadow ? "0 0 15px #ccc" : "")};

  @media screen and (max-width: ${BREAKPOINT}) {
    position: sticky;
    width: 100%;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

export const Container = styled.div`
  display: grid;
  padding: 15px 40px;
  align-items: center;
  justify-content: center;
  grid-template-rows: 1fr;
  grid-template-columns: 140px 200px minmax(200px, 400px) 110px 130px 36px 36px;
  column-gap: 15px;
  margin: 0 auto;

  @media screen and (max-width: ${XL}) {
    grid-template-columns: 140px 120px minmax(200px, 300px) 40px 40px 36px 36px;
    padding: 15px 0;
  }

  @media screen and (max-width: ${BREAKPOINT}) {
    grid-template-columns: repeat(3, 30px) minmax(113px,128px) repeat(2, 30px);
    grid-template-rows: 1fr 36px;
    gap: 30px 7px;
    padding: 40px 15px 30px 15px;
    box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.07);
    top: 0;
    left: 0;
    width: 100%;
    background: ${customStyles.yellow};
    z-index: 3;

    > div {
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
  }
`;

export const HeaderClip = styled.div<{ isB2E: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: calc(max(calc((100% - 1010px) / 2), 125px) - ${({ isB2E }) => (isB2E ? "50px" : "0px")});
  height: 100%;
  background: ${({ isB2E }) => customStyles[isB2E ? "burgundy" : "yellow"]};
  overflow: hidden;
  z-index: -1;
  display: flex;
  align-items: center;
  justify-content: end;

  &:after {
    content: "";
    position: absolute;
    right: 0;
    top: 50%;
    width: 50px;
    height: 120%;
    background: white;
    transform: translate(50%, -50%);
    border-radius: 50%;
  }

  @media screen and (max-width: ${XL}) {
    width: calc(max(calc((100% - 670px) / 2), 86px) - ${({ isB2E }) => (isB2E ? "50px" : "0px")});
  }

  @media screen and (max-width: ${BREAKPOINT}) {
    width: 100%;

    &:after {
      right: unset;
      top: unset;
      bottom: 0;
      left: 50%;
      width: 250%;
      height: 175%;
      transform: translate(-50%, 50%);
    }
  }
`;

export const HeaderClipTextWrapper = styled.div`
  height: 1em;
  display: flex;
  align-items: center;
  justify-content: end;
  flex-wrap: wrap;
  overflow: hidden;
  margin-left: 10px;
  margin-right: 50px;

  @media screen and (max-width: ${BREAKPOINT}) {
    display: none;
  }
`;

export const HeaderClipText = styled.span`
  color: white;
  font-weight: bold;
  font-size: 18px;
  height: 100%;
`;

export const Logo = styled.div<{ isB2E?: boolean }>`
  cursor: pointer;

  img {
    height: ${({ isB2E }) => (!isB2E ? "30px" : "34px")};
  }

  @media screen and (max-width: ${BREAKPOINT}) {
    order: 1;

    > :first-child {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 5px;
    }
  }
`;

export const LogoText = styled.span`
  font-size: 12px;
  opacity: 70%;
  display: none;

  @media screen and (max-width: ${BREAKPOINT}) {
    display: unset;
  }
`;

export const Address = styled.div`
  grid-template-columns: 20px 100%;
  display: grid;
  align-items: center;
  flex: 1;
  cursor: pointer;

  @media screen and (max-width: ${BREAKPOINT}) {
    display: flex;
    grid-template-columns: unset;
    align-items: center;
    justify-content: center;
  }
`;

export const AddressText = styled.span`
  font-family: MullerMedium;
  font-weight: 500;
  font-size: 14px;
  margin: 0 8px;
  line-height: 15px;
  max-height: 45px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  @media screen and (max-width: ${BREAKPOINT}) {
    display: none;
  }
`;

export const Total = styled.div`
  font-family: MullerMedium;
  font-weight: 500;
  font-size: 14px;
  line-height: 14px;
  margin: 0 32px;
`;

export const CartWrapper = styled.div<{ big?: boolean; onSidebar?: boolean }>`
  cursor: pointer;
  position: relative;
  transition: all 0.2s linear;
  transform: scale(1);
  animation: ${(props) => (props.big ? "pulse 1s infinite;" : "none")};
  color: ${customStyles.red};

  &:hover {
    opacity: 0.8;
  }
  @media (max-width: ${BREAKPOINT}) {
    display: flex;
    justify-content: center;
    order: ${({ onSidebar }) => (onSidebar ? "unset" : 2)};
  }
`;

export const CartText = styled.span`
  font-family: MullerBold;
  font-size: 8px;
  color: ${customStyles.red};
  position: absolute;
  display: flex;
  text-align: center;
  width: 16px;
  height: 16px;
  border-radius: 9999px;
  background: white;
  top: 0;
  right: 10%;
  align-items: center;
  justify-content: center;
  border: 1px solid ${customStyles.red};

  @media (max-width: ${BREAKPOINT}) {
    right: 0;
  }
`;

export const MenuWrapper = styled.div<any>`
  display: flex;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.2s linear;
  svg {
    width: 20px;
    height: 16px;
  }
  &:hover {
    opacity: 0.8;
  }

  @media screen and (max-width: ${BREAKPOINT}) {
    order: 2;
  }
`;

export const SideMenu = styled.div<any>`
  position: fixed;
  overflow: auto;
  top: 0;
  z-index: 400;
  right: 0;
  bottom: 0;
  background: white;
  padding: 32px;
  transform: translateX(100%);
  transition: transform 0.2s linear;
  &.open {
    transform: translateX(0);
  }
  @media screen and (max-width: ${BREAKPOINT}) {
    width: 100%;
  }
`;

export const CloseRow = styled.div`
  display: flex;
  align-items: center;
  > div {
    display: none;
    &:last-child {
      display: block;
    }
    @media screen and (max-width: ${BREAKPOINT}) {
      display: block;
    }
  }
`;

export const CloseWrapper = styled.div`
  text-align: right;
  cursor: pointer;
  flex: 1;
  > svg {
    width: 14px;
    height: 14px;
  }
`;

export const MenuList = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
`;

export const MenuItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  > svg {
    width: 20px;
    height: 20px;
  }
  a,
  span {
    text-decoration: none;
    font-family: MullerMedium;
    font-size: 16px;
    line-height: 16px;
    color: var(--black);
    margin-left: 10px;
  }
`;

export const MenuBottom = styled.div`
  // position: absolute;
  // bottom: 50px;
  display: flex;
  align-items: flex-end;
  flex-grow: 1;
  img {
    margin-bottom: -10px;
  }
  span {
    margin-left: 20px;
    font-family: MullerBold;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.015em;
    color: var(--black);
  }
`;

export const MenuListTools = styled.div`
  display: flex;
  margin-bottom: 30px;
  > div:first-child {
    margin-right: 20px;
  }
`;

export const InputGroup = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  flex: 1;
  background: #ffffff;
  border-radius: 44px;
  max-width: 618px;
  height: 45px;
  box-shadow: 0px 8px 42px -6px rgba(0, 0, 0, 0.15);

  svg {
    position: absolute;
    left: 20px;
    display: none;
  }

  button {
    padding: 0 40px;
    position: relative;
    height: 45px;

    &:before {
      content: "";
      background: url(${BuscarIcon}) no-repeat center center / contain;
      display: block;
      width: 20px;
      height: 20px;

      position: absolute;
      left: 15px;
    }

    &:hover {
      &:before {
        background: url(${BuscarIconRed}) no-repeat center center / contain;
      }
    }
    span {
      font-family: MullerBold;
      font-size: 14px;
      line-height: 20px;
      text-transform: uppercase;

      position: relative;
      left: 10px;
    }
  }

  @media screen and (max-width: ${XL}) {
    button {
      padding: 0 23px;
      height: 45px;
      &:before {
        width: 15px;
        left: 50%;
        transform: translate(-50%, 0);
      }

      span {
        display: none;
      }
    }
  }

  @media (max-width: ${BREAKPOINT}) {
    order: 3;
    grid-column: 1 / -1;
    margin-right: 0;
    height: 36px;
    max-width: none;

    button {
      height: 36px;
      padding: 0 18px;
    }
  }
`;

export const InputGroupSearchInput = styled.input`
  min-width: 0;
  background: none;
  border: 0;
  padding: 15px 0px 15px 25px;
  font-family: MullerBold;
  font-size: 14px;
  line-height: 14px;
  display: flex;
  align-items: center;
  letter-spacing: 0.01em;
  color: var(--black);
  flex: 1;

  &::placeholder {
    color: ${customStyles.darkGrey};
    font-size: 14px;
    line-height: 20px;
    font-family: MullerRegular;
  }

  @media (max-width: ${BREAKPOINT}) {
    padding: 0 25px;
  }
`;

export const Category = styled.div<{ showSubCategories: boolean; isVisible: boolean }>`
  align-items: center;
  margin-bottom: 30px;
  > svg {
    width: 20px;
    height: 20px;
  }
  span {
    text-decoration: none;
    font-family: MullerMedium;
    font-size: 16px;
    line-height: 16px;
    color: var(--black);
    margin-left: 30px;
  }
  ${({ isVisible }) => (isVisible ? "display: block;" : " display:none; ")}
  ${({ showSubCategories }) => (showSubCategories ? " li { display: block; }" : " li { display:none; } ")}
`;

export const Subcategory = styled.li`
  margin: 14px 0px 14px 50px;
`;
