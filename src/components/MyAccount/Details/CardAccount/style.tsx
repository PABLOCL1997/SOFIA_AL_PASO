import styled from "styled-components";
import { customStyles, LG } from "../../../../utils/constants";

export const Wrapper = styled.div`
  background: #ffffff;
  box-shadow: 0px 6px 74px rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  padding: 20px 25px 20px;
  height: fit-content;

  @media (max-width: ${LG}) {
    padding: 20px 25px 0;
  }
`;

export const Headline = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  h4 {
    font-size: 20px;
    line-height: 28px;
    color: ${customStyles.red};
    font-family: 'MontserratMedium';
  }
`;

export const EditButton = styled.div`
  display: flex;
  align-items: center;

  cursor: pointer;

  img {
    margin-right: 5px;
  }
  span {
    font-size: 12px;
    line-height: 18px;
    color: ${customStyles.red};
    font-family: 'MontserratMedium';
  }
`;

export const InputsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 0 20px;

  @media (max-width: ${LG}) {
    display: block;
  }
`;

export const InputGroup = styled.div`
  input {
    background: var(--f-gray);
    border-radius: 44px;
    width: calc(100% - 60px);
    border: 1px solid transparent;

    padding: 15px 30px;
    margin-bottom: 20px;
    font-family: 'MontserratMedium';
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
    font-family: 'MontserratMedium';
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

export const Input = styled.input``;

export const ErrorInputMsg = styled.div<{ margin?: string }>`
  position: relative;
  top: -12px;
  max-width: 250px;
  display: flex;
  align-items: end;

  margin: ${(props) => (props.margin ? props.margin : "auto")};

  span {
    font-family: 'MontserratMedium';
    font-size: 12px;
    line-height: 18px;
    color: var(--red);

    position: relative;
    left: 5px;

    display: block;
  }
`;
