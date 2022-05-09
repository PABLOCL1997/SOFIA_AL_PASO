import styled from "styled-components";
import { BREAKPOINT } from "../../../utils/constants";

export const ModalCourtain = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  z-index: 300;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;  
`;

export const Modal = styled.div`
  position: relative;
  padding: 52px;
  background: white;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 380px;
  max-width: 100%;  
`;

export const Title = styled.h2`
  font-family: 'MontserratMedium';  font-size: 24px;
  line-height: 24px;
  color: var(--black);
  flex: 1;
  text-align: center;
  @media screen and (max-width: ${BREAKPOINT}) {
    font-size: 18px;
  }
`;

export const CloseIcon = styled.img`
  cursor: pointer;
  position: absolute;
  top: 15px;
  right: 15px;
  filter: invert(52%) sepia(6%) saturate(16%) hue-rotate(32deg) brightness(96%) contrast(82%);
  width: 12px;
  aspect-ratio: 1 / 1;
  &:hover {
    opacity: 0.5;
  }
`;

export const Option = {
  Wrapper: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
  `,
  Icon: styled.img`
  `,
  Title: styled.h4`
    margin-top: 24px;
    font-family: 'MontserratMedium';
    font-style: normal;
    font-size: 16px;
    line-height: 20px;
    color: #000000;
    max-width: 150px;
    text-align: center;
  `,
  Box: styled.div<{ selected: boolean }>`
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 170px;
    background-color: ${({ selected }) => selected ? "rgba(254,205,0,0.6)" : "rgba(240,240,240,0.6)"};
    border-radius: 16px;

    &:hover {
      cursor: pointer;
    }    
  `,
  Description: styled.p`
    max-width: 200px;
    text-align: center;
  `,
  New: styled.strong`
    position: absolute;
    top: 10px;
    right: 10px;
    border-radius: 10px;
    font-size: 10px;
    padding: 2px 5px;
    background-color: var(--red);
    color: var(--white);
  `
};

export const Options = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
`;