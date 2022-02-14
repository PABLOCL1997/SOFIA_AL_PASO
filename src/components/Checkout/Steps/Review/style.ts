import styled from "styled-components";
import { BREAKPOINT } from "../../../../utils/constants";

export const Heading = styled.h1`
  font-family: MullerRegular;
  font-weight: bold;
  font-size: 16px;
  line-height: 16px;
  color: var(--red);

  margin: 0 0 32px;
  img {
    display: none;
    position: absolute;
    cursor: pointer;
  }
  h2 {
    font-family: MullerMedium;
    font-size: 16px;
    line-height: 16px;
    color: var(--red);
    flex: 1;
  }
  @media screen and (max-width: ${BREAKPOINT}) {
    flex-direction: column;
    h2 {
      padding-left: 42px;
    }
    span {
      margin-top: 10px;
    }
    img {
      display: block;
    }
  }
`;

export const Title = {
  Container: styled.article`
    display: flex;
    justify-content: space-between;
  `,
  Label: styled.h2`
    font-family: MullerMedium;
    font-size: 16px;
    line-height: 16px;
    color: var(--red);
    margin-bottom: 30px;
  `,
  Link: styled.a`
    cursor: pointer;
    color: var(--red);
    font-family: MullerBold;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 14px;
    /* identical to box height */

    text-align: right;
    text-decoration-line: underline;

    img {
      margin-right: 10px;
    }
  `,
};

const GridSeparation = `
  grid-column-gap: 20px;
  grid-row-gap: 20px;
  margin-bottom: 30px;
`;

export const Content = {
  InputGroup: styled.div<{ key: string }>`
    display: flex;
    flex-direction: column;
    label {
      font-family: MullerMedium;
      font-size: 10px;
      line-height: 10px;
      letter-spacing: 0.01em;
      text-transform: uppercase;
      color: var(--font);
      padding-left: 20px;
    }
    input,
    em {
      background: none;
      border-radius: 44px;
      font-family: MullerMedium;
      font-size: 14px;
      line-height: 14px;
      display: flex;
      align-items: center;
      letter-spacing: 0.01em;
      color: var(--black);
      padding: 12px 20px;
      border: 0;
      margin-top: 10px;
    }

    ${({ key }) =>
      key === "street" &&
      `
      display: grid;
      grid-column: 1 / span 2;
      @media screen and (max-width: ${BREAKPOINT}) {
        grid-column: 1 / span 1;
      }    
    `}
  `,
  Billing: {
    Fields: styled.article`
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      ${GridSeparation}

      @media screen and (max-width: ${BREAKPOINT}) {
        grid-template-columns: 1fr;
      }
    `,
  },
  Shipping: {
    Fields: styled.article`
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: repeat(4, 1fr);
      ${GridSeparation}

      @media screen and (max-width: ${BREAKPOINT}) {
        display: grid;
        grid-column: unset;
        grid-template-columns: 1fr;
      }
    `,
  },
  Timeframe: {
    Fields: styled.article`
      display: grid;
      grid-template-columns: 1fr;
    `,
    Info: styled.em`
      font-family: MullerMedium;
      font-size: 14px;
      line-height: 14px;
      color: var(--black);

      padding: 0 20px 12px;
      margin-bottom: 30px;
    `,
  },
  Payment: {
    Fields: styled.article`
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 1fr;
      ${GridSeparation}
    `,
  },
};

export const gridSpan2CSS: React.CSSProperties = {
  gridColumn: "1 / span 2",
};

export const emptyCSS: React.CSSProperties = {};

export const Back = {
  Wrapper: styled.div`
    margin-bottom: 32px;
    @media screen and (max-width: ${BREAKPOINT}) {
      display: none;
    }
  `,
};

export const Footer = {
  Wrapper: styled.footer`
    display: none;
    position: fixed;
    width: 100%;
    height: 242px;
    left: 0;
    bottom: 0;

    background: linear-gradient(0deg, #ffffff 0%, rgba(255, 255, 255, 0.94) 48.91%, rgba(255, 255, 255, 0) 82.18%);
    @media screen and (max-width: ${BREAKPOINT}) {
      display: block;
    }
  `,
  Total: styled.section`
    display: flex;
    position: fixed;
    padding: 0 24px;
    justify-content: space-between;
    bottom: 78px;
    width: 100%;

    font-size: 14px;
    line-height: 20px;
    font-style: normal;
    em {
      font-family: MullerMedium;
      font-weight: normal;
    }
    strong {
      font-family: MullerBold;
      font-weight: bold;
    }
  `,
  Cta: styled.section`
    position: fixed;
    padding: 0 24px;
    bottom: 28px;
    width: 100%;

    a,
    button {
      width: 100%;
      font-size: 12px;
      line-height: 16px;
      text-transform: uppercase;
      height: 40px;
    }
  `,
};
