import styled from "styled-components";
import { BREAKPOINT, customStyles } from "../../../utils/constants";

export const Wrapper = styled.div<{ withMap: boolean }>`
  ${({ withMap }) =>
    withMap
      ? `
            display: grid;
            grid-template-columns: 320px 500px;       
        `
      : `
            display: flex;
            justify-content: center;
        `}

  @media screen and (max-width: ${BREAKPOINT}) {
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: center;
  }
`;

export const Selector = styled.div<{ withMap: boolean }>`
  display: flex;
  flex-direction: column;

  ${({ withMap }) => withMap && `margin-right: 48px;`}

  ${({ withMap }) =>
    withMap
      ? `
    align-items: flex-start;
    justify-content: flex-start;
    `
      : `
    align-items: center;
    justify-content: center;
  `}

  svg {
    width: 32px;
    margin-top: 30px;
    @media screen and (max-width: ${BREAKPOINT}) {
      margin-top: 15px;
      width: 30px;
    }
  }

  a {
    font-family: MullerMedium;

    width: 100%;
    ${({ withMap }) =>
      withMap
        ? `
        margin: 24px 0 40px;
        `
        : `
        margin: 24px 0 40px;
        `}
    font-size: 12px;
    line-height: 16px;
    color: var(--red);

    text-align: center;

    @media screen and (max-width: ${BREAKPOINT}) {
      margin: 0px 0 10px;
    }
  }

  button {
    align-self: flex-end;
    font-family: MullerBold;
    text-transform: uppercase;
    color: white;
    ${({ withMap }) => (withMap ? `width: 100%;` : `width: 300px;`)}

    height: 39px;
    left: 260px;
    top: 617px;

    /* Rojo Sofía */
    border: none;
    background: #e30613;
    box-shadow: 0px 8px 29px rgba(227, 6, 19, 0.39);
    border-radius: 44px;

    @media screen and (max-width: ${BREAKPOINT}) {
      font-size: 12px;
    }
  }
  @media screen and (max-width: ${BREAKPOINT}) {
    align-items: center;
    justify-content: center;
    margin-right: 0;
  }
`;

export const Title = styled.h3`
  margin-top: 17px;
  font-family: MullerMedium;

  font-size: 24px;
  line-height: 32px;

  @media screen and (max-width: ${BREAKPOINT}) {
    margin-top: 10px;
    align-text: center;
    font-size: 20px;
  }
`;
export const Subtitle = styled.h4<{ withMap: boolean }>`
  margin-top: 8px;
  font-family: MullerMedium;

  font-size: 16px;
  line-height: 20px;
  max-width: 300px;
  ${({ withMap }) => (withMap ? ` text-align: left;` : ` text-align: center;`)}

  @media screen and (max-width: ${BREAKPOINT}) {
    margin-top: 6px;
    font-size: 14px;
  }
`;

export const Addresses = styled.div<{ withMap: boolean }>`
  width: 100%;
  margin: 10px 0;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  ${({ withMap }) => !withMap && `margin-left: 120px;`}

  flex-direction: column;
  flex-grow: 1;
  max-height: 230px;
  overflow: auto;

  &::-webkit-scrollbar {
    background: transparent; /* Chrome/Safari/Webkit */
    width: 0px;
  }

  @media screen and (max-width: ${BREAKPOINT}) {
    margin-left: 0px;
  }
`;
export const RadionGroup = styled.div<{ selected: boolean }>`
  display: grid;
  grid-template-columns: 16px 1fr;

  padding: 5px 10px;
  border-radius: 30px;
  margin-top: 10px;
  border: 1px solid transparent;
  cursor: pointer;
  text-align: left;
  &.selected {
    border: 1px solid var(--red);
  }
  input {
    cursor: pointer;
    -webkit-appearance: none;
    display: inline-block;
    vertical-align: middle;
    width: 16px;
    height: 16px;
    border-radius: 100%;
    border: 1px solid var(--red);
    &:checked {
      background: var(--red);
      box-shadow: 0 0 0 3px white inset;
    }
  }
  label {
    cursor: pointer;
    font-family: MullerMedium;
    font-size: 14px;
    line-height: 14px;
    ${({ selected }) =>
      selected
        ? `
        color: var(--red);
        `
        : `
        color: var(--black);
        `}
    margin-left: 10px;
  }
`;

export const InputReference = styled.div`
  width: 100%;
  margin: 20px 0;

  input {
    font-size: 12px;
    font-family: MullerRegular;
    float: left;
    border-radius: 30px;
    border: 0px;
    background-color: #f0f0f0;
    padding: 10px 10px;
    width: 250px;
  }
`;

export const AddressesLabel = styled.div`
  margin-top: 10px;
  color: ${customStyles.darkGrey};
`;
