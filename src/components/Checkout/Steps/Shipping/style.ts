import styled from "styled-components";
import { BREAKPOINT } from "../../../../utils/constants";

export const Title = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  margin-bottom: 30px;
  img {
    display: none;
    position: absolute;
    cursor: pointer;
  }
  h2 {
    font-family: 'MontserratMedium';
    font-size: 16px;
    line-height: 16px;
    color: var(--red);
    flex: 1;
  }
  span {
    font-family: 'MontserratMedium';
    font-size: 12px;
    line-height: 12px;
    color: var(--black);
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

export const Form = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 24px;
  row-gap: 30px;
  @media screen and (max-width: ${BREAKPOINT}) {
    grid-template-columns: 1fr;
    column-gap: 0;
  }
`;

export const InputGroup = styled.div<{ key: string; withLabel: boolean }>`
  display: flex;
  flex-direction: column;
  label {
    font-family: 'MontserratMedium';
    font-size: 10px;
    line-height: 10px;
    letter-spacing: 0.01em;
    text-transform: uppercase;
    color: var(--font);
    padding-left: 20px;
    opacity: ${(props) => (props.withLabel ? "1" : "0")};
  }
  input {
    background: var(--whiter);
    border-radius: 44px;
    font-family: 'MontserratMedium';
    font-size: 14px;
    line-height: 14px;
    display: flex;
    align-items: center;
    letter-spacing: 0.01em;
    color: var(--font);
    padding: 12px 20px;
    border: 0;
    margin-top: 10px;
    &.error {
      border: 1px solid var(--red);
    }
  }
`;

export const OtherAddressWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const Other = styled.button<{ margin: boolean }>`
  font-family: 'MontserratMedium';  font-size: 14px;
  line-height: 14px;
  text-decoration-line: underline;
  color: var(--red);
  border: 0;
  background: none;
  margin: 20px 0 ${(props) => (props.margin ? "40px" : "0")};
  &:hover {
    opacity: 0.8;
  }
`;

export const CheckboxGroup = styled.div<{ red: boolean }>`
  display: grid;
  grid-template-columns: 20px 1fr 13px;

  align-items: center;
  margin-bottom: 20px;
  input {
    -webkit-appearance: none;
    border: 2px solid var(--${(props) => (props.red ? "red" : "font")});
    border-radius: 4px;
    width: 20px;
    height: 20px;
    cursor: pointer;
    &:checked {
      background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAqCAYAAAD1T9h6AAAACXBIWXMAACxLAAAsSwGlPZapAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJsSURBVHgB1ZhRbtNAEIZn13FA4sVqi8RDIrU3SG9QH6EnQJwAeOONcoLCSSJOkN6gvQEVzhtN8SPUjpcdU1Vpas/O2rvx9pMsRd6J/Y9n91+PAZ4BPyA5zOL9hT5+Z+N9pY85nsMxAYGDQkdxdKmVJltDeXm3Po4gYFB8PI4WWvybhuGXUspZsBXQ4hMt/lIBHBJhuYRA0dNmbhCPJEEm8DPeO9fT5sQUpxP8HtwUysYHn7W0M2OgUnkZVcdBJZDFe+9BiK+s4Eqk0/LmYgSBkI2SE654IcTHiRaPv4NIoN6URDTnRasvk7+rh0QH3wcMXv8YBd+mxe2nzVODrgGm1/9HwcW0WKXbpwe1UabX66esrstX69OmscES4Ho9ii9klR7led48PgC2Xn/0J79uC9l5Al28ngrZqY129XqKnSXQx+spdrIP9PV6Cu9rwIXXU8j7m7T2nH1x4fXk/6ieUyiZTopfV9AR9Hq9GD+Y4h68nrDLNuRoHJ03iEcSJarFMn49gw6g13PEo9d3FY8InDKGGOtKuPZ6ColPwBBjVQlbr+8jHtGLWHCeLCsJe6+/4VWJQJbR+h2jCgiZxIbXJ8Yrodff3Z6BA+p9YBknMwVS31yYb96wJnx7PUW9D0yK/EpAlXathG+vp6+5QZdKVLB+69vr6etuYZkED8Z7fVeedGSW04mHkqc+xCONLaXLJFx4PUVrT+wmCTdeT2F8ne68Jur3+pX5XagnrH7AOgnHXk/B+qxiM518eD0F+7sQJwnTNxwfWLeUrdPJo9dTWH+Za62ER6/3AlZCNy51D718ceDdbbyASQwt/h8riHszQZr28wAAAABJRU5ErkJggg==");
      background-position: center center;
      background-size: 12px;
      background-repeat: no-repeat;
    }
  }
  label {
    font-family: 'MontserratMedium';
    font-size: 14px;
    line-height: 14px;
    color: var(--font);
    padding-left: 10px;
    cursor: pointer;
  }
`;

export const SelectWrapper = styled.div`
  position: relative;
  cursor: pointer;

  select {
    -webkit-appearance: none;
    width: 100%;
    background: var(--whiter);
    border-radius: 44px;
    font-family: 'MontserratMedium';
    font-size: 14px;
    line-height: 14px;
    display: flex;
    align-items: center;
    letter-spacing: 0.01em;
    color: var(--font);
    padding: 10px 20px;
    border: 0;
    margin-top: 10px;
    cursor: pointer;
  }

  svg {
    pointer-events: none;
    position: absolute;
    top: 24px;
    right: 20px;
    path {
      stroke: var(--red);
    }
  }
`;
export const StarWrap = styled.div`
  position: relative;
  padding: 0 0 2px 5px;

  &:hover {
    > div {
      opacity: 1;
      visibility: visible;
    }
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

  /* &.hover {
    opacity: 1;
    visibility: visible;
  } */

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

    @media screen and (max-width: ${BREAKPOINT}) {
      display: block;
      padding: 32px 0;
      
      * > button {
        width: 100%;
      }
    }
  `,
}

export const Back = {
  Wrapper: styled.div`
    margin-bottom: 32px;
    cursor: pointer;
    @media screen and (max-width: ${BREAKPOINT}) {
      display: none;
    }
  `,
}

export const ArrowImg = styled.img`
  margin-left: 10px;
`;

export const TitleGuest = styled.h2`
  font-family: 'MontserratBold' !important;
`;
