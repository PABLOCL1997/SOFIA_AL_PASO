import styled from "styled-components";
import { customStyles, LG } from "../../../utils/constants";

export const Wrapper = styled.div`
  background-color: #fbfcfc;
  padding: 0 40px 40px;
  border-radius: 20px;

  @media (max-width: ${LG}) {
    background-color: #f9f9f9;
    padding: 0 15px 40px;
  }

  h3 {
    font-size: 24px;
    line-height: 32px;
    color: ${customStyles.black};
    font-family: 'Montserrat', sans-serif;
    font-weight: 500;
    padding: 20px 0 15px;
  }
`;

export const GridDatos = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;

  @media (max-width: ${LG}) {
    display: block;
  }
`;

export const InputsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 0 20px;
`;

export const InputGroup = styled.div`
  input {
    background: var(--f-gray);
    border-radius: 44px;
    width: calc(100% - 60px);
    border: 1px solid transparent;

    padding: 15px 30px;
    margin-bottom: 20px;
    font-family: 'Montserrat', sans-serif;
    font-weight: 500;
    font-size: 14px;
    line-height: 14px;
    letter-spacing: 0.01em;
    color: var(--black);
    &::placeholder {
      color: var(--font);
    }

    &.error {
      border: 1px solid var(--red) !important;
    }

    &:focus {
      border: 1px solid var(--black);
    }
  }

  input[disabled] {
    cursor: not-allowed;
  }

  label {
    font-family: 'Montserrat', sans-serif;
    font-weight: 500;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: ${customStyles.black};
    margin-left: 30px;

    font-size: 12px;
    line-height: 18px;

    margin-bottom: 5px;
    display: block;
  }
`;

export const LoaderWrapperBig = styled.div`
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 50px;
  }
`;
