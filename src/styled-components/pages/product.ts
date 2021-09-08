import styled from "styled-components";
import { BREAKPOINT, customStyles } from "../../utils/constants";

export const Header = styled.div`
  padding: var(--padding);
  display: flex;
  justify-content: space-between;
  @media screen and (max-width: ${BREAKPOINT}) {
    padding: 20px;
    justify-content:  space-between;
  }
`;

export const HeaderLink = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  @media screen and (max-width: ${BREAKPOINT}) {
    flex-direction: row-reverse;
  }
  span {
    font-size: 16px;
    line-height: 16px;
    color: var(--red);
    margin-right: 10px;
    cursor: pointer;
  }
  svg {
    cursor: pointer;
    @media screen and (max-width: ${BREAKPOINT}) {
      transform: rotate(180deg);
      margin-right: 10px;
    }
  }
`;

export const Wrapper = styled.div`
  padding: var(--padding);
  display: flex;
  @media screen and (max-width: ${BREAKPOINT}) {
    flex-direction: column;
    padding: 20px;
  }

  .slick-slide img {
    margin: 0 auto;
    width: 100%;
    height: 354px;
    object-fit: contain;

    @media (max-width: ${BREAKPOINT}) {
      object-fit: contain;
      width: 100%;
      height: 250px;
    }
  }
`;

export const Col1 = styled.div`
  width: calc(50% - 8px);
  margin-right: 16px;
  .slick-dots {
    bottom: -25px;
    li {
      background: var(--btn-background);
      box-shadow: 0 0 0 1px var(--black);
      border-radius: 20px;
      width: 12px;
      height: 12px;
      opacity: 0.35;
      * {
        opacity: 0;
      }
    }
    .slick-active {
      box-shadow: 0 0 0 1px var(--btn-background);
      opacity: 1;
    }
  }
  @media screen and (max-width: ${BREAKPOINT}) {
    width: 100%;
    margin-right: 0;
    margin-bottom: 16px;
  }
`;

export const Col2 = styled.div`
  flex: 1;
`;

export const Image = styled.div<{ src: string; srcSet?: string }>`
  height: 354px;
  background: url(${props => props.src}) no-repeat center center / contain;

  @media screen and (max-width: ${BREAKPOINT}) {
    height: 250px;
  }
`;

export const ProductTitle = styled.h2`
  font-family: MullerBold;
  font-size: 30px;
  line-height: 30px;
  color: var(--black);
  margin-bottom: 16px;
  @media screen and (max-width: ${BREAKPOINT}) {
    font-size: 20px;
    line-height: 20px;
    margin-top: 30px;
  }
`;

export const ProductText = styled.ul`
  li {
    font-size: 14px;
    line-height: 14px;
    color: black;
    margin-bottom: 14px;
    &:before {
      content: "\\2022";
      color: var(--red);
      font-weight: bold;
      font-size: 30px;
      display: inline-block;
      vertical-align: middle;
      margin-right: 10px;
    }
  }
`;
ProductText.displayName = "ProductText";

export const Categories = styled.div`
  margin: 25px 0;
  display: flex;
  align-items: center;
  @media screen and (max-width: ${BREAKPOINT}) {
    margin: 32px 0;
  }
  span {
    font-family: MullerMedium;
    font-size: 10px;
    line-height: 10px;
    color: var(--black);
    margin-right: 5px;
  }
  a {
    font-family: MullerMedium;
    font-size: 10px;
    line-height: 10px;
    text-decoration-line: underline;
    color: var(--red);
    &:hover {
      opacity: 0.8;
    }
  }
`;

export const Toolbox = styled.div`
  display: flex;
  margin: 24px 0 50px;
  button {
    padding: 11px 80px;
    margin-left: 20px;
  }

  @media screen and (max-width: ${BREAKPOINT}) {
    position: fixed;
    bottom: 0;
    background: white;
    width: 100%;
    left: 0;
    padding: 30px;
    margin: 0;
    z-index: 3;
    button {
      font-size: 14px;
      text-transform: uppercase;
      padding: 15px 70px;
      margin: 0 15px;
      span {
        font-family: MullerExtraBold;
      }
    }
  }
`;

export const Qty = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid var(--yellow);
  border-radius: 20px;
  padding: 15px;
  select {
    cursor: pointer;
    -webkit-appearance: none;
    background: none;
    border: 0;
    width: 40px;
    padding-left: 10px;
    font-size: 12px;
    line-height: 12px;
    font-family: MullerRegular;
    @media screen and (max-width: ${BREAKPOINT}) {
      color: var(--black);
    }
  }
  svg {
    pointer-events: none;
    position: absolute;
    right: 15px;
  }
`;

export const DeliveryBox = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 25px;
`;

export const Text = styled.div`
  font-size: 12px;
  line-height: 12px;
  color: var(--font);
  margin-top: 5px;
`;

export const Title = styled.div`
  margin-left: 10px;
  span {
    font-family: MullerBold;
    font-size: 12px;
    line-height: 12px;
    color: var(--black);
  }
`;

export const Disclaimer = styled.div`
  font-family: MullerMedium;
  font-size: 14px;
  line-height: 18px;
  color: var(--black);
  @media screen and (max-width: ${BREAKPOINT}) {
    margin-bottom: 30px;
  }
`;

export const PriceBox = styled.div`
  text-align: left;
  margin: 0px 0 10px;
  padding: 0 10px;
  display: flex;
  align-items: flex-start;
  @media screen and (max-width: ${BREAKPOINT}) {
    margin: 0;
    padding: 0;
  }
}
`;

export const Price = styled.div`
  font-size: 24px;
  line-height: 24px;
  color: var(--red);
  margin-bottom: 58px;
  font-family: MullerBold;
  margin: 0px 0px 15px;
  @media screen and (max-width: ${BREAKPOINT}) {
    margin-bottom: 30px;
    font-size: 20px;
    line-height: 20px;
  }
`;

export const EstimatedPrice = styled.div<{ visible?: boolean }>`
  font-family: MullerMedium;
  font-size: 14px;
  line-height: 14px;
  text-align: left;
  color: var(--font);
  padding: 5px 10px;
  display: ${props => (props.visible ? "block" : "none")};
  @media screen and (max-width: ${BREAKPOINT}) {
    padding: 5px 0;
  }
`;

export const Label = styled.div<{ visible?: boolean }>`
  font-family: MullerMedium;
  font-size: 24px;
  line-height: 24px;
  text-align: left;
  color: var(--font);
  padding: 0 10px 5px 0;
  display: ${props => (props.visible ? "block" : "none")};
  @media screen and (max-width: ${BREAKPOINT}) {
    font-size: 20px;
    line-height: 20px;
  }
`;

export const DiscountPrice = styled.span`
  color: var(--red);
  font-size: 14px;
  margin-left: 5px;
  text-decoration: line-through;
`;

export const CloseWrapper = styled.div`
  cursor: pointer;
  flex: 1;
  svg {
    margin-top: 0;
    margin-left: 5px;
    path {
      stroke: var(--red);
    }
  }
  &:hover {
    opacity: 0.8;
  }
`;

export const OutOfStock = styled.span`
  font-family: MullerBold;
  color: var(--red);
  border: 1px solid var(--red);
  padding: 10px 100px;
  border-radius: 30px;
  align-items: center;
  text-aling: center;
  margin: 0 auto;
  font-family: MullerMedium;
  font-size: 16px;
  line-height: 16px;
`;

export const BreadWrap = styled.div`
  margin: 35px 0;  
  padding: 0;
  ul {
    li {
      a {
        color: ${customStyles.darkGrey};
        font-size: 12px;
        line-height: 16px;
      }
    }
  }

  @media screen and (max-width: ${BREAKPOINT}) {
    margin: 0;
  }
`;

export const MainContainer = styled.div`
  width: 100%;
  max-width: 1440px;
  margin: 10px auto;
  padding: 0 20px;

  @media screen and (max-width: 768px) {
    .main-container {
        padding: 0;
    }
  }
`
