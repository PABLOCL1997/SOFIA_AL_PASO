import styled from "styled-components";
import { customStyles, transition } from "../../../utils/constants";
import { LG } from "../../../utils/constants";

export const Wrapper = styled.div`
  padding: 0 40px;

  @media (max-width: ${LG}) {
    padding: 0 20px;
  }
`;

export const Headline = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 30px 0;

  @media (max-width: ${LG}) {
    > div {
      width: 100%;

      button {
        width: 100%;
        display: flex;
        justify-content: center;
      }
    }
  }
`;

export const Title = styled.h3`
  font-size: 24px;
  line-height: 32px;
  font-family: "MullerMedium";
`;

export const TablaWrap = styled.div``;

export const TablaHead = styled.div`
  display: grid;
  grid-template-columns: 1fr /*1fr*/ 1fr 1.2fr 1fr 1.3fr 1fr 0.7fr;
  border-bottom: 1px solid #cbcbcb;
  padding-bottom: 15px;

  h5 {
    font-size: 12px;
    line-height: 18px;
    color: ${customStyles.darkGrey};

    font-family: "MullerMedium";
  }
`;

export const Tabla = styled.div``;

export const TablaLista = styled.ul`
  padding-bottom: 60px;
`;
TablaLista.displayName = "TablaLista";

export const TablaItem = styled.li<{ filtered?: boolean; index?: string }>`
  display: grid;
  grid-template-columns: 1fr /*1fr*/ 1fr 1.2fr 0.9fr 1.4fr 0.3fr 1fr;
  padding: 20px 0;
  border-bottom: 1px solid #cbcbcb;

  animation: ${(props) => (props.filtered ? `visible 0.5s forwards` : "none")};

  @media (max-width: ${LG}) {
    background-color: #ffffff;
    margin-bottom: 20px;
    border: 0;
    box-shadow: 0px 6px 74px rgba(0, 0, 0, 0.06);
    border-radius: 8px;
    padding: 10px 0;

    display: flex;
    justify-content: space-between;

    > img {
      padding-right: 20px;
    }
  }
`;
TablaItem.displayName = "TablaItem";

export const Fecha = styled.span`
  font-size: 14px;
  line-height: 20px;
  color: ${customStyles.black};
`;

export const Order = styled.div`
  font-size: 14px;
  line-height: 20px;
  color: ${customStyles.black};
`;

export const Canal = styled.div`
  span {
    font-size: 14px;
    line-height: 20px;
    color: ${customStyles.black};
    padding-left: 7px;
  }
`;

export const Price = styled.h6`
  font-family: "MullerMedium";
  font-size: 14px;
  line-height: 20px;
  color: ${customStyles.black};
`;
Price.displayName = "Price";

export const VerDetalleBtn = styled.button`
  display: flex;
  align-items: center;

  font-family: "MullerMedium";
  font-size: 14px;
  line-height: 20px;
  color: ${customStyles.red};
  border: 1px solid ${customStyles.red};
  background-color: #ffffff;
  border-radius: 4px;
  width: 106px;

  span {
    font-family: "MullerMedium";
    margin-left: 5px;
  }

  img {
    padding-left: 2px;
  }

  transition: ${transition("ease-out", "0.2s")};

  &:hover {
    box-shadow: var(--btn-shadow);
  }
`;

export const RepetirCompraBtn = styled.button`
  display: flex;
  align-items: center;

  font-family: "MullerMedium";
  font-size: 14px;
  line-height: 20px;
  color: ${"#ffffff"};
  border: 1px solid ${customStyles.red};
  background-color: ${customStyles.red};
  border-radius: 4px;
  width: 140px;

  margin: 0 0 0 auto;

  span {
    font-family: "MullerMedium";
    margin-left: 5px;
  }

  img {
    padding-left: 2px;
  }

  transition: ${transition("ease-out", "0.2s")};

  &:hover {
    box-shadow: var(--btn-shadow);
  }
`;

export const Paginator = styled.div`
  margin: -35px auto 0;
  text-align: center;
  padding-bottom: 35px;

  ul {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;

    div {
      width: 27px;
      height: 27px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      cursor: pointer;
    }

    img {
      cursor: pointer;
    }
  }
`;

export const Li = styled.li<{ index?: number; current?: number }>`
  display: inline-block;
  margin: 0;

  font-size: 14px;
  line-height: 20px;
  color: var(--black);
  font-style: normal;
  font-weight: 500;
  background-color: ${(props) => (props.index === props.current ? "transparent" : "transparent")};
  color: ${(props) => (props.index === props.current ? customStyles.red : customStyles.black)};

  width: 27px;
  height: 27px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
`;

export const ArrowPrev = styled.img<{ disable: boolean }>`
  opacity: ${(props) => (props.disable ? "0.5" : "1")};
  transform: rotate(-180deg);
`;

export const ArrowNext = styled.img<{ disable: boolean }>`
  opacity: ${(props) => (props.disable ? "0.5" : "1")};
`;

export const Anchor = styled.div`
  position: absolute;

  top: -20px;
  right: 0;
  left: 0;
`;

export const TablaItemMobile = styled.div`
  padding: 0 20px;

  @media (max-width: ${LG}) {
    ${Fecha} {
      color: ${customStyles.darkGrey};
      padding-left: 13px;
    }
  }
`;

export const OrderMobile = styled.div`
  display: flex;
  align-items: center;
  padding: 3px 0;

  > div {
    padding-left: 13px;
    font-family: "MullerMedium";
    font-size: 16px;
    padding-right: 5px;
  }
  > h6 {
    font-family: inherit;
    font-size: 16px;
  }
`;

export const LoaderWrapper = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;
  min-height: 150px;
  img {
    width: 40px;
  }
`;

export const CtaWrapper = styled.div`
  a {
    text-decoration: none;

    button {
      padding: 15px 100px;
      text-transform: uppercase;

      position: relative;
      bottom: -90px;
      margin-bottom: 70px;
      span {
        font-family: MullerBold;
      }
    }
  }
`;
