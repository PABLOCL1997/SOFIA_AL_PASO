import React, { FC, Suspense, useState } from "react";
import styled from "styled-components";
import { ProductType } from "../../graphql/products/type";
import { useTranslation } from "react-i18next";
import { toLink } from "../../utils/string";
import { BREAKPOINT, customStyles } from "../../utils/constants";
import DiscountIcon from "../../assets/images/descuento.svg";
import { NewDiscount, ProductLink, BottomCard } from "../../styled-components/ItemBoxStyles";
import useCart from "../../hooks/useCart";
import useProduct from "../../hooks/useProduct";
import { Link } from "react-router-dom";

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../Loader"));

const Container = styled.div`
  position: relative;
  background: #ffffff;
  /*   box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.06); */
  box-shadow: 0px 2px 9px rgb(0 0 0 / 9%);
  border-radius: 16px;
  margin: 20px 10px 15px;
  padding: 14px 10px 22px;
`;

const Discount = styled.div`
  position: absolute;
  top: -20px;
  right: 8px;
  background: var(--red);
  box-shadow: 0px 8px 29px rgba(254, 205, 0, 0.4);
  border-radius: 3px;
  font-family: 'MontserratBold';  font-size: 14px;
  line-height: 14px;
  display: flex;
  align-items: flex-end;
  text-align: left;
  color: var(--black);
  padding: 3px 4px 1px;
  div {
    display: flex;
    flex-direction: column;
    color: white;
    &:first-child {
      font-size: 28px;
      font-weight: bold;
      margin-right: 2px;
      padding-bottom: 5px;
    }
    &:last-child {
      padding-top: 5px;
    }
    span {
      font-size: 8px;
      font-weight: bold;
      &:first-child {
        line-height: 5px;
        font-size: 12px;
      }
    }
  }
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
  border-radius: 20px;
  border: 3px white double;
  font-size: 12px;
  letter-spacing: 0.2px;
  z-index: 2;

  border: 0;
  border-radius: 4px;
  background-color: ${customStyles.yellow};

  color: ${customStyles.red};
  font-family: 'MontserratBold';  padding: 7px 0 5px;
`;

const Category = styled.h3`
  font-size: 14px;
  line-height: 14px;
  text-align: center;
  letter-spacing: 0.05em;
  color: var(--red);
  text-transform: uppercase;
`;

const Image = styled.img`
  max-width: 100%;
  height: 200px;
  margin: 0 auto;
  display: block;
`;
Image.displayName = "ItemBoxImage";

const Title = styled.h2`
  font-family: 'MontserratMedium';  font-size: 16px;
  line-height: 20px;
  text-align: left;
  color: var(--black);
  min-height: 90px;
  padding: 0 10px;

  margin-bottom: 15px;
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
  font-family: 'MontserratBold';  font-size: 16px;
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

const Pill = styled.div`
  border: 1px solid var(--yellow);
  border-radius: 30px;
  display: flex;
  width: fit-content;
  margin: 0 auto;
`;

const Qty = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  select {
    cursor: pointer;
    -webkit-appearance: none;
    background: none;
    border: 0;
    width: 65px;
    padding-left: 30px;
    font-size: 12px;
    line-height: 12px;
  }
  svg {
    pointer-events: none;
    position: absolute;
    right: 0;
  }
`;

const Add = styled.button`
  font-family: 'MontserratBold';  border: 0;
  background: var(--yellow);
  color: var(--black);
  padding: 11px 20px;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  margin-left: 10px;
  font-size: 10px;
  line-height: 10px;
  text-transform: uppercase;
  transition: all 0.2s linear;
  &:hover {
    background: none;
    color: var(--red);
    box-shadow: 1px 0px var(--yellow) inset;
  }
`;

const EstimatedPrice = styled.div<{ visible?: boolean }>`
  font-family: 'MontserratMedium';  font-size: 12px;
  line-height: 12px;
  text-align: left;
  color: ${customStyles.black};
  padding: 5px 0;
  opacity: ${(props) => (props.visible ? 1 : 0)};
`;

const Label = styled.div<{ visible?: boolean }>`
  font-family: 'MontserratRegular';
  font-size: 12px;
  line-height: 12px;
  text-align: center;
  color: #808080;
  padding: 5px 10px;
  opacity: ${(props) => (props.visible ? 1 : 0)};
`;

const MaxUnits = styled.div`
  font-size: 12px;
  font-family: 'MontserratBold';  line-height: 12px;
  text-align: center;
  letter-spacing: 0.05em;
  color: var(--red);
  text-transform: uppercase;
`;

const OutOfStock = styled.span`
  font-family: 'MontserratBold';  border: 0;
  color: var(--black);
  padding: 11px 20px;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  margin-left: 10px;
  font-size: 10px;
  line-height: 10px;
  text-transform: uppercase;
`;

type Props = {
  product: ProductType;
  openModal?: Function;
  dropDownQty?: number;
  webp?: Boolean;
};

const ItemBox: FC<Props> = ({ product, openModal, dropDownQty = 21, webp = false }) => {
  const { t } = useTranslation();
  const [qty, setQty] = useState<number>(1);
  const { addAndGo } = useCart();
  const { related } = useProduct(product.name);

  const replaceWidthFormatImage = (name: string, width: string, format?: string) => {
    if (name.includes(".jpg")) return name.replace(".jpg", `_${width}.${format ? format : "jpg"}`);
    if (name.includes(".jpeg")) return name.replace(".jpeg", `_${width}.${format ? format : "jpeg"}`);
    if (name.includes(".png")) return name.replace(".png", `_${width}.${format ? format : "png"}`);
  };

  const discount = (1 - product.special_price / product.price) * 100;

  return (
    <Suspense fallback={<Loader />}>
      <Container>
        {discount > 0 && (
          <NewDiscount>
            <img width="32" height="48" src={DiscountIcon} alt="%" />
          </NewDiscount>
        )}

        <Link to={`/${String(product.name).toLowerCase().replaceAll("-", "--").replace(/ /g, "-")}`}>
          {product.isNew && <NewLabel>{t("itembox.new")}</NewLabel>}
          <img
            className="lazyload"
            width="200px"
            height="200px"
            srcSet={webp ? `${replaceWidthFormatImage(product.image.split(",")[0], "200px", "webp")}` : `${replaceWidthFormatImage(product.image.split(",")[0], "200px")},`}
            style={{ margin: "0 auto", display: "block" }}
            alt={product.name}
          />

          <Title>
            {product.useKGS ? `${product.name} DE ${Number(product.weight).toFixed(2).replace(".", ",")} KGS APROX.` : product.name}
            <EstimatedPrice visible={product.useKGS}>(Bs. {(product.special_price / product.weight).toFixed(2).replace(".", ",")}/ KGS)</EstimatedPrice>
          </Title>
          {product.maxPerUser > 0 && <MaxUnits>{t("itembox.max_per_user", { units: product.maxPerUser })}</MaxUnits>}

          <BottomCard>
            <PriceBox>
              {discount > 0 && <DiscountPrice>Bs. {product.price.toFixed(2).replace(".", ",")}</DiscountPrice>}

              <Price>Bs. {(product.special_price || 0).toFixed(2).replace(".", ",")}</Price>
            </PriceBox>
            <Label visible={product.useKGS}>{t("itembox.price_label")}</Label>
          </BottomCard>
        </Link>
        {product.stock > 0 ? (
          <Pill>
            <Qty>
              <select defaultValue={1} onChange={(event) => setQty(Number(event.target.value))}>
                {[...(Array(dropDownQty).keys() as any)].slice(1).map((opt: any, index: number) => (
                  <option key={index} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {/* Chevron */}
              <svg width="11" height="6" viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1.38452L5.5 5.077L10 1.38452" stroke="#808080" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Qty>
            <Add onClick={() => addAndGo(product, qty, related)}>{t("itembox.add")}</Add>
          </Pill>
        ) : (
          <Pill>
            <OutOfStock>TEMPORALMENTE SIN STOCK</OutOfStock>
          </Pill>
        )}
      </Container>
    </Suspense>
  );
};

export default ItemBox;
