import styled from "styled-components";
import { customStyles, LG } from "../../../utils/constants";

export const Wrapper = styled.div``;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2.2fr;
  grid-gap: 0 40px;

  padding-bottom: 80px;
`;

export const Headline = styled.div``;

export const BackButton = styled.button`
  cursor: pointer;
  background: transparent;
  border: 0;
  margin: 20px 0 20px;

  img {
    transform: rotate(-180deg);
    opacity: 0.7;
    margin-right: 6px;
  }

  span {
    font-family: 'Montserrat', sans-serif;
    font-weight: 500;
    font-size: 12px;
    line-height: 18px;
    color: ${customStyles.darkGrey};

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const OrderTitle = styled.h3`
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  font-size: 24px;
  line-height: 32px;
  color: ${customStyles.red};

  margin-bottom: 25px;
`;

export const Card = styled.div`
  background: ${customStyles.ultraLight};
  box-shadow: 0px 6px 74px rgba(0, 0, 0, 0.2);
  border-radius: 8px;

  padding: 20px;
`;

export const CardHead = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;

  > div {
    &:first-child {
      margin-right: 40px;
    }
  }

  h5 {
    font-size: 12px;
    line-height: 18px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: ${customStyles.black};

    font-family: 'Montserrat', sans-serif;
    font-weight: 500;
    margin-bottom: 2px;
  }
`;

export const EnvioYFacturacion = styled.div`
  margin-bottom: 30px;

  h5 {
    font-size: 12px;
    line-height: 18px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: ${customStyles.black};
    font-family: 'Montserrat', sans-serif;
    font-weight: 500;
    margin-bottom: 2px;
  }

  ul {
    li {
      font-size: 16px;
      line-height: 24px;
      color: ${customStyles.black};
      padding: 2px 0;

      a {
        color: ${customStyles.black};
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  @media (max-width: ${LG}) {
    margin-left: 16px;
  }
`;

export const CtaWrap = styled.div`
  button {
    display: flex;
    justify-content: center;
    width: 100%;

    span {
      font-family: 'Montserrat', sans-serif;
      font-weight: bold;
      font-size: 14px;
      line-height: 20px;
      padding: 7px 0;
    }
  }
`;

export const TablaWrap = styled.div``;

export const TablaHead = styled.div`
  display: grid;
  grid-template-columns: 1fr 5fr 1fr 1fr 1fr;
  border-bottom: 1px solid #cbcbcb;

  padding: 0 0 10px;
  margin: 0 0 20px;
  span {
    font-size: 12px;
    line-height: 18px;
    font-family: 'Montserrat', sans-serif;
    font-weight: 500;
    color: ${customStyles.darkGrey};

    &:last-child {
      margin: 0 0 0 auto;
    }
  }
`;

export const TablaContent = styled.div`
  div {
    display: grid;
    grid-template-columns: 1fr 5fr 1fr 1fr 1fr;
    margin-bottom: 15px;
  }

  span {
    font-size: 14px;
    line-height: 20px;
    color: ${customStyles.black};

    &:last-child {
      margin: 0 0 0 auto;
    }
  }
`;
TablaContent.displayName = "TablaContent";

export const SubtotalWrap = styled.div`
  margin-top: 40px;
  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;

    h6,
    span {
      font-size: 14px;
      line-height: 20px;
      color: ${customStyles.black};
    }

    h6 {
      font-family: 'Montserrat', sans-serif;
      font-weight: bold;
      margin-bottom: 10px;
    }

    h5 {
      font-size: 20px;
      line-height: 28px;
      font-family: 'Montserrat', sans-serif;
      font-weight: 500;
    }
  }

  @media (max-width: ${LG}) {
    > div {
      h6 {
        font-family: 'Montserrat', sans-serif;
        font-weight: 500;
      }
      h5 {
        font-size: 16px;
        line-height: 24px;
        font-family: inherit;
      }
    }
  }
`;

export const Divider = styled.span`
  height: 1px;
  background-color: #cbcbcb;
  display: block;

  margin: 20px 0 15px;
`;

export const Estado = styled.div`
  display: flex;
  align-items: center;
  span {
    font-size: 14px;
    line-height: 20px;
    color: ${customStyles.black};
    padding-left: 5px;
  }
`;

export const EstadoCircle = styled.div<{ color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
`;

export const GridMobile = styled.div``;

export const ProductsCardMobile = styled.div`
  background: #ffffff;

  box-shadow: 0px 6px 74px rgba(0, 0, 0, 0.06);
  border-radius: 8px;

  padding: 15px;

  margin-bottom: 30px;
`;

export const ProductsHeadline = styled.div`
  > div {
    &:first-child {
      display: flex;
      justify-content: space-between;
    }
  }
  border-bottom: 1px solid #cbcbcb;
  padding-bottom: 20px;

  ${OrderTitle} {
    font-size: 20px;
    line-height: 28px;
    color: ${customStyles.black};
    margin: 0;
    padding: 10px 0;
  }
`;

export const ProductsTable = styled.div`
  margin-top: 25px;
`;

export const ProductItem = styled.div`
  margin-bottom: 30px;

  span {
    color: ${customStyles.darkGrey};
    font-size: 14px;
    line-height: 20px;
  }

  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  h5 {
    font-weight: bold;
    font-size: 14px;
    line-height: 20px;

    padding-bottom: 5px;
    max-width: 220px;
  }
`;

export const DatosTablaMobile = styled.div``;

export const FechaMobile = styled.div`
  font-family: inherit;
  font-size: 14px;
  line-height: 20px;
`;

export const SubtotalMobile = styled.div``;

export const DatosContent = styled.div``;

export const NumeroOrden = styled.div``;
