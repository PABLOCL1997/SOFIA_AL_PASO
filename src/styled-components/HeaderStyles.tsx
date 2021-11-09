import styled from "styled-components";
import { BREAKPOINT, customStyles } from "../utils/constants";
import BuscarIcon from "../assets/images/buscar-zoom.svg";
import BuscarIconRed from "../assets/images/buscar-zoom-red.svg";

export const IngresarWrap = styled.div<{ action?: any }>`
  cursor: pointer;

  img {
    margin-right: 5px;
  }

  span {
    font-size: 14px;
    line-height: 20px;
    color: ${customStyles.red};
    font-family: MullerMedium;
  }

  @media screen and (max-width: 995px) {
    display: flex;
    justify-content: center;
    span {
      display: none;
    }
  }
`;

export const AddressHeader = styled.div`
  > div {
    grid-template-columns: 20px 100%;
    display: grid;
  }

  span {
    line-height: 15px;
    max-height: 45px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  @media screen and (max-width: 768px) {
    order: 4;
    grid-column: 1 / 5;
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
  background: ${customStyles.yellow};
  left: 0;
  top: 0;
  z-index: 11;
  box-shadow: ${(props) => (props.shadow ? "0 0 15px #ccc" : "")};
  @media screen and (max-width: 768px) {
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
  padding: 12px 40px;
  align-items: center;
  justify-content: center;
  grid-template-rows: 1fr;
  grid-template-columns: 100px 200px minmax(200px, 400px) 100px 150px 36px 36px;
  column-gap: 15px;

  margin: 0 auto;

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr repeat(4, 36px);
    grid-template-rows: 1fr 36px 36px;
    row-gap: 5px;
    column-gap: 5px;
    padding: 20px 25px;
    box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.07);
    top: 0;
    left: 0;
    width: 100%;
    background: ${customStyles.yellow};
    z-index: 3;
  }
`;

export const Logo = styled.div`
  cursor: pointer;
  @media screen and (max-width: 768px) {
    img {
      width: 60px;
      height: 36px;
    }
  }
`;

export const Address = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  cursor: pointer;
  span {
    font-family: MullerMedium;
    font-weight: 500;
    font-size: 14px;
    line-height: 14px;
    margin: 0 8px;
  }
`;

export const Total = styled.div`
  font-family: MullerMedium;
  font-weight: 500;
  font-size: 14px;
  line-height: 14px;
  margin: 0 32px;
`;

export const CartWrapper = styled.div<any>`
  cursor: pointer;
  position: relative;
  transition: all 0.2s linear;
  transform: scale(1);
  animation: ${(props) => (props.big ? "pulse 1s infinite;" : "none")};
  span {
    font-family: MullerBold;
    font-size: 8px;
    color: white;
    position: absolute;
    top: 5px;
    right: 5px;
    display: block;
    width: 14px;
    height: 14px;
    text-align: center;
    line-height: 14px;
  }
  &:hover {
    opacity: 0.8;
  }
  @media (max-width: ${BREAKPOINT}) {
    display: flex;
    justify-content: center;
    span {
      right: 3px;
    }
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
  svg {
    position: absolute;
    left: 20px;
    display: none;
  }
  input {
    background: none;
    border: 0;
    padding: 15px 25px;
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
  }
  button {
    padding: 14px 40px;
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

  @media (max-width: ${BREAKPOINT}) {
    order: 5;
    grid-column: 1 / 5;
    margin-right: 0;
    height: 36px;

    input {
      padding: 0 25px;
    }
    span {
      display: none;
    }

    button {
      padding: 14px 18px;
      height: 36px;
      &:before {
        width: 15px;
        left: 50%;
        transform: translate(-50%, 0);
      }
    }
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
