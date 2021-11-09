import React, { FC, Suspense, useState } from "react";
import styled from "styled-components";
import { ProductType } from "../../graphql/products/type";
import { useTranslation } from "react-i18next";
import { capitalizeFirstLetter, toLink } from "../../utils/string";
import { BREAKPOINT, customStyles } from "../../utils/constants";
import DiscountIcon from "../../assets/images/descuento.svg";
import { NewDiscount, BottomCardHome } from "../../styled-components/ItemBoxStyles";
import useCart from "../../hooks/useCart";
import { Link } from "react-router-dom";
import useProduct from "../../hooks/useProduct";

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../Loader"));

const Container = styled.div<{ featured?: boolean; homeCategories?: boolean }>`
  position: relative;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 2px 9px rgb(0 0 0 / 9%);
  border-radius: 16px;

  margin: 20px 10px 15px;
  padding: 14px 10px 22px;

  ${({ featured, homeCategories }) =>
    featured
      ? `
    margin: 0 16px 0 0; 
    padding: 1px 0 0;
    height: 303px;
    width: 269px;

    img {
      max-width: 187px;
      max-height: 130px;
      width: auto;
      height: auto;
    }

    @media screen and (max-width: ${BREAKPOINT}) {

      width: 190px;
      height: 290px;

      img {
        max-width: 175px;
        max-height: 123px;
        width: auto;
        height: auto;
      }
    }
    `
      : homeCategories
      ? `
    margin: 0 16px 0 0;
    padding: 1px 0 0;
    height: 358px;
    width: 269px;

    img {
      max-width: 242px;
      max-height: 170px;
      width: auto;
      height: auto;
    }

    @media screen and (max-width: 1024px) {
      &:first-child {
        margin: 0 16px;
      }
    }

    @media screen and (max-width: ${BREAKPOINT}) {

      width: 190px;
      height: 290px;

      img {
        max-width: 175px;
        max-height: 123px;
        width: auto;
        height: auto;
      }

      &:first-child {
        margin: 0 16px;
      }
    `
      : ``}
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
  font-family: MullerBold;
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
  font-family: MullerMedium;
  font-size: 16px;
  line-height: 20px;
  max-height: 40px;
  color: var(--black);
  text-align: center;
  overflow: hidden;
  white-space: wrap;
  text-overflow: ellipsis;
  margin: 8px 15px 0;
  @media screen and (max-width: ${BREAKPOINT}) {
    height: auto;
  }
`;

const PriceBox = styled.div`
  text-align: center;
  margin: 0;
  padding: 0;

  span {
    display: block;
    margin: 0;
    text-align: left;
  }
`;

const Price = styled.span`
  font-family: MullerBold;
  font-size: 14px;
  color: var(--red);
`;

const Weight = styled.span`
  font-family: MullerBold;
  color: var(--black);
`;

const DiscountPrice = styled.span`
  color: ${customStyles.darkGrey};
  margin-left: 5px;
  text-decoration: line-through;

  font-size: 12px;
  line-height: 16px;
`;

const Pill = styled.div<{ featured: boolean; homeCategories: boolean }>`
  border: 1px solid var(--yellow);
  border-radius: 30px;
  display: flex;
  align-self: flex-end;
  width: fit-content;
  margin: 16px auto 22px;

  ${({ featured, homeCategories }) =>
    featured || homeCategories
      ? `   
   @media screen and (max-width: ${BREAKPOINT}) {
     left: 12px;
     bottom: 24px;
    }
   `
      : ``}
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
  font-family: MullerBold;
  border: 0;
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

const Block = styled.div`
  padding-top: 9px;
`;

const Label = styled.div<{ visible?: boolean }>`
  // line-height: 12px;
  text-align: left;
  color: #808080;

  opacity: ${(props) => (props.visible ? 1 : 0)};
`;

const MaxUnits = styled.div`
  font-size: 12px;
  font-family: MullerBold;
  line-height: 12px;
  text-align: center;
  letter-spacing: 0.05em;
  color: var(--red);
  text-transform: uppercase;
`;

const OutOfStock = styled.span`
  font-family: MullerBold;
  border: 0;
  color: var(--black);
  padding: 11px 20px;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  margin-left: 10px;
  font-size: 10px;
  line-height: 10px;
  text-transform: uppercase;
`;

const PriceAndWeight = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  flex-grow: 1;
`;

type Props = {
  product: ProductType;
  openModal?: Function;
  dropDownQty?: number;
  webp?: boolean;
  featured?: boolean;
  homeCategories?: boolean;
};

const ItemBoxHome: FC<Props> = ({ product, openModal, dropDownQty = 21, webp = false, featured = false, homeCategories = false }) => {
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
      <Container featured={featured} homeCategories={homeCategories}>
        {discount > 0 && (
          <NewDiscount>
            <img width="32" height="48" src={DiscountIcon} alt="%" />
          </NewDiscount>
        )}
        {product.isNew && <NewLabel>{t("itembox.new")}</NewLabel>}
        <Block>
          <Link to={`/${String(product.name).toLowerCase().replaceAll("-", "--").replace(/ /g, "-")}`}>
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
              {/* {capitalizeFirstLetter(product.name)} */}
            </Title>
            {product.maxPerUser > 0 && <MaxUnits>{t("itembox.max_per_user", { units: product.maxPerUser })}</MaxUnits>}
          </Link>
        </Block>
        <PriceAndWeight>
          {product.useKGS ? (
            <BottomCardHome>
              <Label visible={true}>(Bs. {(product.special_price / product.weight).toFixed(2).replace(".", ",")}/ KGS)</Label>
            </BottomCardHome>
          ) : null}
          <BottomCardHome>
            {product.useKGS ? <Label visible={true}>Estimado:&nbsp;</Label> : <Label visible={true}>Precio:&nbsp;</Label>}
            <PriceBox>
              {discount > 0 && <DiscountPrice>Bs. {product.price.toFixed(2).replace(".", ",")}</DiscountPrice>}

              <Price>Bs. {(product.special_price || 0).toFixed(2).replace(".", ",")}</Price>
            </PriceBox>
          </BottomCardHome>
        </PriceAndWeight>
        {product.stock > 0 ? (
          <Pill featured={featured} homeCategories={homeCategories}>
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
          <Pill featured={featured} homeCategories={homeCategories}>
            <OutOfStock>TEMPORALMENTE SIN STOCK</OutOfStock>
          </Pill>
        )}
      </Container>
    </Suspense>
  );
};

export default ItemBoxHome;
