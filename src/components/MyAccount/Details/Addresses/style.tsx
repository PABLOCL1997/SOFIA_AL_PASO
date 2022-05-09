import styled from "styled-components";
import { BREAKPOINT } from "../../../../utils/constants";

export const ContainerTable = styled.div`  
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const ListAddress = styled.ul`
`;

export const Address = styled.li`
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--m-gray);
  padding: 15px 0px;
`;

export const AddressTitle = styled.h4<{ isBold: boolean }>`  
font-weight: ${({isBold}) => isBold ? "bold" : ""};
  &:hover {
    cursor: pointer;
    color: var(--red);
  }
`;

export const DeleteWrapper = styled.div`
  cursor: pointer;
  margin-left: auto;
`;

export const Pages = styled.div`
  display: flex;
  gap: 20px;
`;

export const Page = styled.span<{ isSelected: boolean }>`
  font-size: 14px;
  color: ${({isSelected}) => isSelected ? "var(--red)" : "var(--black)"};
  &:hover {
    cursor: pointer;
  }
`;

export const Arrow = styled.img<{ rotate?: boolean, disable: boolean }>`
  transform: ${({rotate}) => rotate ? "rotate(180deg)" : ""}; 
  &:hover {
    cursor: pointer;
  };
  opacity: ${({disable}) => disable ? "0.5" : ""};
  width: 7px;
`;

export const Title = styled.h4`
  font-size: 20px;
  line-height: 28px;
  color: rgb(227, 6, 19);
  font-family: 'MontserratMedium';  border-bottom: 1px solid rgb(203, 203, 203);
  padding-bottom: 15px;
`;

export const AddressesContainer = styled.div`
  padding: 20px 30px 0px;
`;

export const AddAddress = styled.button`
  font-family: 'MontserratMedium';  font-size: 14px;
  line-height: 14px;
  text-decoration: underline;
  color: var(--red);
  background: rgba(0, 0, 0, 0) none repeat scroll 0% 0%;
  border: 0px none;
  margin-left: auto;
`;

export const ModalCourtain = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  z-index: 500;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 25px;   
`;

export const Modal = styled.div<{ fullSize?: boolean, padding?: string }>`
  position: relative;
  padding: ${({ padding }) => padding ? padding : "0"};
  background: white;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  overflow-x: hidden;
  ${({ fullSize }) => fullSize &&`
    @media screen and (max-width: ${BREAKPOINT}) {
      min-width: 100%;
      height: 100vh;
      border-radius: 0;
      justify-content: flex-start;
    }
 `};  
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 20px 30px;
  box-sizing: border-box;
  box-shadow: 0px 6px 74px rgba(0, 0, 0, 0.1);
  @media screen and (max-width: ${BREAKPOINT}) {
    padding: 15px 30px;
  }
  @media screen and (max-height: 600px) {
    padding: 10px 30px;  
  }
`;

export const HeaderTitle = styled.h2`
  font-family: 'MontserratMedium';  font-size: 20px;
  line-height: 20px;
  color: var(--black);
  @media screen and (max-width: ${BREAKPOINT}) {
    font-size: 14px;
    line-height: 14px;
  }
`;

export const CloseWrapper = styled.div`
  cursor: pointer;
  margin-left: auto;
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

export const Form = {
  Wrapper: styled.form`
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 10px 30px 20px 30px;
    box-sizing: border-box;
    width: 100%;    
  `,
  Input: styled.input` 
    background: var(--whiter);
    border-radius: 44px;
    font-family: 'MontserratMedium';
    font-size: 14px;
    line-height: 14px;    
    letter-spacing: 0.01em;
    color: var(--font);
    box-sizing: border-box;
    padding: 12px 20px;
    border: 0;
    margin-top: 10px;
    width: 100%;
    &.error {
      border: 1px solid var(--red);
    }
  `,
  Label: styled.label`
    font-family: 'MontserratMedium';
    font-size: 10px;
    line-height: 10px;
    letter-spacing: 0.01em;
    text-transform: uppercase;
    color: var(--font);
    padding-left: 20px;
    margin-top: 20px;
  `,
  Select: styled.select<{ isB2E: boolean }>`
    position: relative;
    -webkit-appearance: none;
    width: 100%;
    min-height: 40.5px;
    background: var(--whiter);
    border-radius: 44px;
    font-family: 'MontserratMedium';
    font-size: 14px;
    line-height: 14px;
    display: flex;
    align-items: center;
    letter-spacing: 0.01em;
    color: var(--font);
    padding: 12px 20px 10px 20px;
    box-sizing: border-box;
    border: 0;
    margin-top: 10px;
    cursor: pointer; 
    background-image: ${({ isB2E }) => !isB2E ? 'url("/images/chevron.svg")' : "none"};
    background-repeat: no-repeat;
    background-size: 12px;
    background-position: 95% 50%;
    &.error {
      border: 1px solid var(--red);
    }    
    @media screen and (max-width: ${BREAKPOINT}) {
      background-position: 97% 50%;
    }
    @media screen and (max-height: 700px) {
      background-position: 97% 50%;
    }
  `,
  Group: styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px;
    & > div {
      width: 100%;
      min-width: 250px;
    }
    @media screen and (max-width: ${BREAKPOINT}) {
      flex-direction: column;
      width: 100%;
    }    
  `,
  CtaWrapper: styled.div`
    width: 100%;
    button {
      padding: 10px 50px;
      margin: 30px auto 0 auto;
    }
  `,
  Map: styled.div<{ mapError: boolean }>`
    width: 100%;
    div.gmapContainer {
      margin-top: 20px;
      width: 100%; 
    }

    div#gmap {
      border: ${({mapError}) => mapError ? "1px solid var(--red)" : ""};
      height: 200px !important;
      @media screen and (max-height: 700px) {
        height: 250px;
      }
    }

    div.gmapGeo {
      position: absolute;
      top: 90%;
      left: calc(50% - 90px);
      @media screen and (max-width: ${BREAKPOINT}) {
        height: max-content;
        left: 50%;
      }
    }

    div.gmapGeo > svg {
      position: initial !important;
    }

    div.gmapPin {
      display: none;
    }

    h2.gmapTitle {
      margin-bottom: 10px;
    }   
    div.gmapWrapper {
      @media screen and (max-width: ${BREAKPOINT}) {
        margin-top: 0px;
      }
    }
  `,
};

export const Loader = styled.img`
  display: flex;
  margin: 30px auto 0 auto;
  width: 30px;
`;

export const StarWrap = styled.div`
  position: relative;

  &:hover {
    cursor: pointer;
    > div {
      opacity: 1;
      visibility: visible;
    }
  }
  
  img {
    vertical-align: initial;
    margin-left: 5px;
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

export const Message = styled.p`
  padding: 20px;
  text-align: center;
  @media screen and (max-width: ${BREAKPOINT}) {
    padding: 0 10px 10px 10px;
  }
`;