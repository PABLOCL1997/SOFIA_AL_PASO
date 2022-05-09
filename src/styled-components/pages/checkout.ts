import styled from "styled-components";
import { BREAKPOINT } from "../../utils/constants";

export const Wrapper = styled.div`
  padding: 24px 100px;
  background: var(--bkg);
  iframe {
    width: 100%;
    height: 730px;
  }
  @media screen and (max-width: ${BREAKPOINT}) {
    padding: 24px;
    background: white;
  }
`;

export const CheckoutWrapper = styled.div``;

export const Cols = styled.div`
  display: flex;
  @media screen and (max-width: ${BREAKPOINT}) {
    flex-direction: column;
  }
`;

export const Col1 = styled.div`
  flex: 1;
`;

export const Col2 = styled.div`
  width: 364px;
  margin-left: 16px;
  @media screen and (max-width: ${BREAKPOINT}) {
    width: 100%;
    margin-left: 0;
    margin-top: 40px;
  }
`;

export const Title = styled.div`
  display: flex;
  padding-right: 380px;
  align-items: center;
  margin-bottom: 25px;
  @media screen and (max-width: ${BREAKPOINT}) {
    padding-right: 0;
  }
  h2 {
    flex: 1;
    font-family: 'MontserratMedium';
    font-size: 32px;
    line-height: 32px;
    color: var(--black);
  }
  button {
    font-family: 'MontserratMedium';
    font-size: 16px;
    line-height: 14px;
    text-align: right;
    text-decoration-line: underline;
    color: var(--red);
    background: none;
    border: 0;
    &:hover {
      opacity: 0.8;
    }
  }
`;

export const Steps = styled.div`

  animation-duration: 0.5s;
  animation-name: slidein;

  @keyframes slidein {
    from {
      margin-left: 50%;
      width: 100%;
    }

    to {
      margin-left: 0%;
      width: 100%;
    }
  }
  background: white;
  border-radius: 20px;
  padding: 40px;
  @media screen and (max-width: ${BREAKPOINT}) {
    padding: 0;
    background: none;
  }
`;

export const Line = styled.div`
  border-top: 1px solid rgba(0, 0, 0, 0.11);
  margin: 48px 0;
`;

export const ShippingMethodWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  margin: 16px 0 40px;

  svg {
    margin-right: 16px;
  }
  h4 {
    margin: 0;
    padding: 0;

    font-size: 20px;
    font-family: 'MontserratMedium';
  }

  a {
    display: none;
  }

  @media screen and (max-width: ${BREAKPOINT}) {
    justify-content: space-between;
    margin: 4px 0 24px;

    a {
      display: block;
      font-family: 'MontserratMedium';
      font-style: normal;
      font-size: 12px;
      line-height: 20px;
      /* identical to box height */

      text-align: right;
      text-decoration-line: underline;

      /* Rojo Sofía */

      color: #E30613;
    }
  }

  
`;

export const Next = {
  Wrapper: styled.div`
    display: flex;
    padding: 64px 0;
    justify-content: flex-start;
    button {
      padding: 14px 48px;
      font-size: 12px;
      font-family: 'MontserratBold';
      text-transform: uppercase;
      line-height: 20px;
    }
  `,
}


export const Courtain = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  z-index: 400;
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  &.visible {
    display: flex;
  }
`;
