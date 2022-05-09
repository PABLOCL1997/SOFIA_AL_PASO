import styled from "styled-components";
import { BREAKPOINT } from "../../utils/constants";

export const Wrapper = styled.div``;

export const ModalCourtain = styled.div`
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
`;

export const Modal = styled.div<{ padding?: string }>`
  position: relative;
  padding: ${(props) => (props.padding ? props.padding : "36px 42px 42px")};
  background: white;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 380px;
  max-width: 100%;

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
`;

export const CloseWrapper = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  > svg {
    width: 12px;
    height: 12px;
  }
`;

export const Title = styled.h2<{ marginBottom?: string; color?: string }>`
  font-family: 'MontserratMedium';  font-size: 24px;
  line-height: 24px;
  color: ${(props) => (props.color ? props.color : "#2F2F2F")};

  margin-bottom: ${(props) => (props.marginBottom ? props.marginBottom : "40px")};

  @media (max-width: ${BREAKPOINT}) {
    text-align: center;
  }
`;

export const Description = styled.p`
  font-family: 'MontserratMedium';  font-size: 12px;
  line-height: 137%;
  letter-spacing: 0.01em;
  color: var(--font);
  margin-bottom: 20px;
  max-width: 250px;
  text-align: center;
`;

export const Link = styled.span<{ position?: string }>`
  font-size: 12px;
  line-height: 12px;
  letter-spacing: 0.01em;
  text-decoration-line: underline;
  color: var(--red);
  cursor: pointer;
  display: ${(props) => (props.position ? "block" : "inline-block")};
  width: 100%;
  text-align: ${(props) => (props.position ? props.position : "left")};
  margin-bottom: 20px;
  &:hover {
    opacity: 0.8;
  }
`;

export const CtaWrapper = styled.div<{ marginBottom?: string, marginTop?: string }>`
  width: 100%;
  button {
    width: 100%;
    padding: 15px 30px;
    text-transform: uppercase;
  }
  margin-bottom: ${(props) => (props.marginBottom ? props.marginBottom : "20px")};
  margin-top: ${(props) => (props.marginTop ? props.marginTop : "20px")};
`;

export const Line = styled.div`
  border-bottom: 2px solid rgba(0, 0, 0, 0.11);
  width: 100%;
  margin-bottom: 20px;
`;

export const SocialButton = styled.button<{ network: string }>`
  width: 190px;
  border: 1px solid var(--${(props) => props.network});
  background: white;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  border-radius: 20px;
  margin-bottom: 20px;
  transition: all 0.3s linear;
  svg {
    margin-right: 10px;
  }
  span,
  b {
    font-size: 12px;
    line-height: 12px;
    color: var(--${(props) => props.network});
  }
  b {
    font-family: 'MontserratBold';
    margin-left: 5px;
  }
  &:hover {
    background: var(--${(props) => props.network});
    * {
      filter: brightness(100);
    }
  }
`;

export const Disclaimer = styled.div<{ margin?: string }>`
  font-size: 12px;
  line-height: 12px;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 0.01em;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: #767474;

  margin: ${(props) => (props.margin ? props.margin : "auto")};

  span {
    width: auto;
    margin-bottom: 0;
    margin-right: 5px;
    font-weight: 500;
    font-family: 'MontserratMedium';
  }
`;

export const LoaderWrapper = styled.div`
  position: absolute;
  background: white;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  border-radius: 20px;
  img {
    width: 50px;
  }
`;

export const SmallTextBtn = styled.button<{ margin?: string }>`
  color: #e30613;
  outline: 0 !important;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  background: transparent;
  border: 0;
  font-family: 'MontserratMedium';  text-decoration-line: underline;
  margin: ${(props) => (props.margin ? props.margin : "auto")};
`;

export const Anchor = styled.a`
  color: var(--red);
  outline: 0 !important;
  font-style: normal;
  font-size: 14px;
  line-height: 20px;
  background: transparent;
  border: 0;
  font-family: 'MontserratMedium';  text-decoration-line: underline;
`;

export const SmallText = styled.p<{ marginBottom?: string }>`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: var(--black);
  max-width: 300px;

  margin-bottom: ${(props) => (props.marginBottom ? props.marginBottom : "20px")};

  &:a {
    text-decoration: underline;
    text-transform: none;
  }
`;

export const QuestionIconWrap = styled.div`
  width: 100%;
  padding-left: 30px;
`;

export const QuestionIconWrapCentered = styled.div`
  width: 100%;
  text-align: center;
`;

export const Lista = styled.ul`
  text-align: center;
  margin-bottom: 24px;

  li {
    margin-bottom: 15px;
  }

  h4 {
    font-family: 'MontserratMedium';
    font-size: 12px;
    line-height: 18px;
    text-align: center;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: var(--black);
    margin-bottom: 5px;
  }

  h5 {
    font-size: 16px;
    line-height: 24px;
    color: var(--black);
    text-align: center;
  }
`;

export const FourCodeInputs = styled.div`
  display: grid;
  grid-template-columns: 35px 35px 35px 35px 35px 35px;
  max-width: 300px;
  grid-gap: 0 10px;
  margin-bottom: 10px;

  input {
    background-color: transparent;
    border-bottom: 1px solid #767474;
    background-color: transparent;
    border-radius: 0;
    width: 100%;
    padding: 0;
    text-align: center;

    font-weight: 500;
    font-size: 32px;
    line-height: 40px;
    border-left: 1px solid transparent;
    border-right: 1px solid transparent;
    border-top: 1px solid transparent;

    &:focus {
      border-left: 1px solid transparent;
      border-right: 1px solid transparent;
      border-top: 1px solid transparent;
    }
  }

  input.filled {
    border-bottom: 1px solid #f0f0f0;
  }
`;

export const InputCode = styled.input<{ pinError?: boolean }>`
  border-bottom: ${(props) => (props.pinError ? "1px solid #E30613 !important" : "")};
`;

export const Counter = styled.div`
  margin-bottom: 20px;
  h4 {
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    color: #01834c;
  }
`;

export const InputLabel = styled.label<{ show?: boolean }>`
  margin: ${(props) => (props.show ? "0 auto 10px 29px" : "0 auto 2px 29px")};
  font-family: 'MontserratMedium';
  /* transition: all ease-out 0.4s; */
  transition: ${(props) => (props.show ? "all ease-out 0.4s" : "none")};
  height: ${(props) => (props.show ? "100%" : "0")};
  overflow: hidden;

  visibility: ${(props) => (props.show ? "visible" : "hidden")};
  opacity: ${(props) => (props.show ? "1" : "0")};

  font-size: 12px;
  line-height: 18px;
  /* identical to box height, or 150% */

  display: flex;
  align-items: center;
  letter-spacing: 0.5px;
  text-transform: uppercase;

  color: var(--black);
`;

export const EmpresaTitle = styled.h5`
  font-size: 16px;
  line-height: 24px;
  color: var(--black);
  text-align: center;

  margin-bottom: 30px;
`;

export const SuccessIcon = styled.img`
  margin: 15px 0 20px;
`;

export const ListaItems = styled.ul`
  max-width: 270px;
  margin: 10px auto auto auto;

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 13px;

    p {
      font-size: 16px;
      line-height: 24px;
      color: var(--black);
    }

    img {
      padding-right: 20px;
    }
  }
`;

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
