import React, { FC, Suspense, useState } from "react";
import styled from "styled-components";
import { ProductType } from "../../graphql/products/type";
import { useTranslation } from "react-i18next";
import { BREAKPOINT, customStyles } from "../../utils/constants";
import DiscountIcon from "../../assets/images/descuento.svg";
import {
  NewDiscount
} from "../../styled-components/ItemBoxStyles";

const Loader = React.lazy(() =>
  import(/* webpackChunkName: "Loader" */ "../Loader")
);

const Container = styled.div`
  position: relative;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 2px 9px rgb(0 0 0 / 9%);
  border-radius: 16px;
  margin: 30px;

`;

const NewLabel = styled.span`
  position: absolute;
  left: 5px;
  top: 5px;
  width: 65px;
  background: var(--red);
  color: white;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
 
  font-size: 12px;
  letter-spacing: 0.2px;
  z-index: 2;

  border: 0;
  border-radius: 4px;
  background-color: ${customStyles.yellow};

  color: ${customStyles.red};
  font-family: 'Montserrat', sans-serif;
  font-weight: bold;
  padding: 7px 0 5px;
`;


const Image = styled.img`
  max-width: 100%;
  height: 200px;
  margin: 0 auto;
  display: block;
`;
Image.displayName = "ItemBoxImage";

const Title = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  text-align: center;
  color: var(--black);

  min-height: 82px;

  @media screen and (max-width: ${BREAKPOINT}) {
    height: auto;
  }
`;

const PriceBox = styled.div`
  text-align: center;
  margin: 0;
  padding: 0 10px 3px;

  span {
    display: block;
    margin: 0;
    text-align: left;
  }
`;

const Price = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-weight: bold;
  font-size: 16px;
  line-height: 16px;
  color: var(--red);
`;

const DiscountPrice = styled.span`
  color: ${customStyles.darkGrey};
  margin-left: 5px;
  text-decoration: line-through;

  font-size: 12px;
  line-height: 16px;
`;


const EstimatedPrice = styled.div<{ visible?: boolean }>`
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  font-size: 12px;
  line-height: 12px;
  text-align: center;
  color: ${customStyles.black};
  padding: 5px 0;
  opacity: ${props => (props.visible ? 1 : 0)};
`;

const Label = styled.div<{ visible?: boolean }>`
  font-family: 'Montserrat', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 12px;
  text-align: center;
  color: #808080;
  padding: 5px 10px;
  opacity: ${props => (props.visible ? 1 : 0)};
`;

const MaxUnits = styled.div`
  font-size: 12px;
  font-family: 'Montserrat', sans-serif;
  font-weight: bold;
  line-height: 12px;
  text-align: center;
  letter-spacing: 0.05em;
  color: var(--red);
  text-transform: uppercase;
`;

const BottomCard = styled.div`
  display: flex;
  justify-content: center;

  padding: 5px 0 10px;
`;

export const ProductLink = styled.a`
  cursor: pointer;

  img {
    display: block;
    margin: 0 auto;
  }
`;

type Props = {
  product: ProductType;
};

const ItemBoxMonitor: FC<Props> = ({ product }) => {
  const { t } = useTranslation();

  const discount = (1 - product.special_price / product.price) * 100;

  return (
    <Suspense fallback={<Loader />}>
      <Container>
        {discount > 0 &&
          <NewDiscount>
            <img width="32" height="48" src={DiscountIcon} alt="%" />
          </NewDiscount>
        }
        {product.isNew &&
          <NewLabel>
            {t("itembox.new")}
          </NewLabel>
        }
        <ProductLink href={`/${String(product.name).toLowerCase().replaceAll("-", "--").replace(/ /g, "-")}`}>
          <img
            className="lazyload"
            width="200px"
            height="200px"
            src={product.image.split(",")[0]}
            alt={product.name}
          />

          <Title>
            {product.useKGS
              ? `${product.name} DE ${Number(product.weight)
                .toFixed(2)
                .replace(".", ",")} KGS APROX.`
              : product.name}
            <EstimatedPrice visible={product.useKGS}>
              (Bs.{" "}
              {(product.special_price / product.weight)
                .toFixed(2)
                .replace(".", ",")}
              / KGS)
            </EstimatedPrice>
          </Title>
          {product.maxPerUser > 0 && (
            <MaxUnits>
              {t("itembox.max_per_user", { units: product.maxPerUser })}
            </MaxUnits>
          )}

          <BottomCard>
            <PriceBox>
              {discount > 0 && (
                <DiscountPrice>
                  Bs. {product.price.toFixed(2).replace(".", ",")}
                </DiscountPrice>
              )}

              <Price>
                Bs.{" "}
                {(product.special_price || 0).toFixed(2).replace(".", ",")}
              </Price>
            </PriceBox>
            {product.useKGS ?
              <Label visible={product.useKGS}>{t("itembox.price_label")}</Label>
              : null
            }
          </BottomCard>
        </ProductLink>
      </Container>
    </Suspense>
  );
};

export default ItemBoxMonitor;
