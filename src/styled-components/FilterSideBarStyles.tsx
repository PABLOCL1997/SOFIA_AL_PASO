import styled from "styled-components";
import { customStyles, BREAKPOINT } from "../utils/constants";

export const TitleWrap = styled.div`
  display: flex;
  align-items: center;
  /*   margin-top: 25px; */
  margin-bottom: 15px;

  h3 {
    font-size: 24px;
    line-height: 32px;
    font-weight: 500;
    font-family: 'MontserratMedium';
    margin-left: 10px;
    color: ${customStyles.black};
  }
`;

export const LevelSub = styled.div<{ show?: boolean; brandSelected?: boolean }>`
  position: absolute;
  z-index: ${(props) => (props.show ? "1" : "-1")};
  background: white;
  top: ${(props) => (props.brandSelected ? "48px" : "48px")};
  bottom: 0;
  width: 100%;
  right: 0;
  overflow: hidden;

  display: ${(props) => (props.show ? "flex" : "none")};
  flex-direction: column;

  padding-top: 5px;

  @media (max-width: ${BREAKPOINT}) {
    /*   top: 100px; */
    height: auto;
  }
`;

export const LevelSub2 = styled.div<{ show?: boolean; index?: any }>`
  position: absolute;
  z-index: ${(props) => (props.index ? "20" : "0")};
  background: white;
  top: 3px;
  bottom: 0;
  right: 0;
  width: 100%;
  overflow: hidden;
  display: ${(props) => (props.show ? "flex" : "none")};
  flex-direction: column; ;
`;

export const LevelSub3 = styled.div<{ show?: boolean }>`
  position: absolute;
  z-index: 3;
  background: white;
  top: 3px;
  bottom: 0;
  right: 0;
  width: 100%;
  overflow: hidden;
  display: ${(props) => (props.show ? "flex" : "flex")};
  flex-direction: column;
  padding-top: 5px;

  border: 1px solid blue;
`;

export const MarcasDesktop = styled.div`
  @media (max-width: ${BREAKPOINT}) {
    display: none;
  }
`;

export const MarcasWrap = styled.div<{ hide?: boolean }>`
  margin-top: 30px;
  display: ${(props) => (props.hide ? "none" : "block")};
  position: relative;
  z-index: 10;
  h3 {
    font-family: 'MontserratBold';
    color: ${customStyles.black};
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.2px;
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  @media (max-width: ${BREAKPOINT}) {
    margin-top: 10px;
  }
`;

export const MarcasList = styled.ul<{ hide?: boolean }>`
  display: ${(props) => (props.hide ? "none" : "block")};

  position: relative;
  z-index: 10;

  .brand-link {
    display: flex;
    align-items: center;
    margin-bottom: 7px;
    cursor: pointer;
  }
`;

export const BrandItem = styled.div<{ selected?: number }>`
  > div {
    display: flex;
    align-items: center;
  }

  h5 {
    font-size: 14px;
    line-height: 20px;
    color: ${customStyles.black};
    font-family: 'MontserratMedium';
    margin-left: 5px;
  }

  span {
    color: ${customStyles.darkGrey};
    font-size: 14px;
    line-height: 20px;
    margin-left: 2px;
  }
`;

export const RadioBtn = styled.div``;

export const TopFilters = styled.div`
  border-top: 1px solid #f0f0f0;
  margin: 15px 0 20px;
  padding-top: 20px;

  > div:first-child {
    display: flex;
    align-items: center;
    justify-content: space-between;

    h5 {
      font-size: 12px;
      line-height: 16px;
      align-items: center;
      letter-spacing: 0.2px;
      color: ${customStyles.black};
      font-family: 'MontserratBold';
      text-transform: uppercase;
    }

    em {
      font-size: 12px;
      line-height: 16px;
      color: ${customStyles.darkGrey};
      font-family: 'MontserratMedium';      text-decoration: underline;
      cursor: pointer;
    }
  }

  @media (max-width: ${BREAKPOINT}) {
    margin-bottom: -70px;
  }
`;
export const TagsWrap = styled.div`
  margin-top: 12px;

  @media (max-width: ${BREAKPOINT}) {
    margin-bottom: 50px;
  }
`;

export const Chip = styled.span`
  position: relative;
  padding: 5px 15px;
  margin: 0 10px 0 0;
  border-radius: 10px;
  background-color: var(--f-gray);
  margin-bottom: 10px;
  display: inline-block;
  cursor: pointer;
`;
export const Cross = styled.div`
  margin: 0px 3px 0px 3px;
  display: inline-block;

  &:hover {
    opacity: 1;
  }
  &:before,
  &:after {
    position: absolute;

    content: " ";
    height: 13px;
    width: 1px;
    background-color: #333;
    bottom: 50%;
    right: 11px;
    margin-bottom: -6px;
  }
  &:before {
    transform: rotate(45deg);
  }
  &:after {
    transform: rotate(-45deg);
  }
`;

export const OrderFilterXsWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (min-width: ${BREAKPOINT}) {
    display: none;
  }
`;

export const OrderAndFilterBtn = styled.button`
  font-size: 12px;
  line-height: 16px;
  color: ${customStyles.black};
  background-color: #ffffff;
  cursor: pointer;
  padding: 14px 40px;
  border: 1px solid ${customStyles.yellow};
  border-radius: 40px;
  width: fit-content !important;
  font-family: 'MontserratBold';`;

export const MobileModal = styled.div`
  @media (min-width: ${BREAKPOINT}) {
    display: none;
  }
`;

export const OrderXsTabs = styled.div`
  margin: 15px 0 10px;
`;

export const ResultadosXs = styled.span`
  font-size: 12px;
  line-height: 16px;
  color: ${customStyles.black};
`;

export const ModalCourtain = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  z-index: 11;
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  &.visible {
    display: flex;
  }
`;

export const Modal = styled.div`
  position: absolute;
  top: 20px;
  /*   position: relative; */
  padding: 42px 20px;
  background: white;
  border-radius: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 600px;

  .close {
    position: absolute;
    top: 20px;
    right: 20px;
  }
  > div {
    width: 100%;
  }
  @media screen and (max-width: ${BREAKPOINT}) {
    width: 100%;
    top: 0;
    bottom: 0;
  }
`;

export const TabContent = styled.div<{ active: boolean; current?: number }>`
  display: ${(props) => (props.active ? "block" : "none")};
  overflow-y: scroll;
  height: ${(props) => (props.current === 0 ? "550px" : "auto")};
`;

export const TabsBtn = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;

  &:first-child {
    > div {
      &:first-child {
        margin-right: 8px;
      }
      &:last-child {
        margin-left: 8px;
      }
    }
  }
`;

export const TabClick = styled.div<{ active: boolean }>`
  border-bottom: 2px solid ${(props) => (props.active ? customStyles.red : customStyles.darkGrey)};

  width: 100%;
  text-align: center;

  span {
    padding-bottom: 5px;
    display: inline-block;
    font-size: 14px;
    line-height: 20px;
    font-family: 'MontserratBold';
    color: ${(props) => (props.active ? customStyles.red : customStyles.darkGrey)};
  }
`;

export const RadioWrap = styled.div`
  margin-top: 20px;
`;

export const RadioLi = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  img {
    margin-right: 5px;
  }

  span {
    font-size: 14px;
    line-height: 20px;
    color: ${customStyles.black};
    font-family: 'MontserratBold';
  }
`;

export const SmallCatImage = styled.img`
  max-width: 18px;
`;
export const TitleCatImage = styled.img`
  max-width: 22px;
`;
