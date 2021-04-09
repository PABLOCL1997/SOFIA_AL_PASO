import React, { FC, Suspense } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { ProductType } from "../graphql/products/type";
import { toLink } from "../utils/string";
import { BREAKPOINT } from "../utils/constants";

const Loader = React.lazy(() =>
  import(/* webpackChunkName: "Loader" */ "./Loader")
);

const Container = styled.div`
  position: relative;
  background: #ffffff;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.06);
  border-radius: 20px;
  margin: 40px 10px;
  padding: 14px 10px 22px;
  @media screen and (max-width: ${BREAKPOINT}) {
    margin: 20px 10px;
  }
`;

const Link = styled.div`
  cursor: pointer;
`;

const Image = styled.img`
  max-width: 100%;
  height: 200px;
  margin: 0 auto;
`;
Image.displayName = 'RelatedItemImage'

const Title = styled.h2`
  font-family: MullerMedium;
  font-size: 16px;
  line-height: 110%;
  text-align: center;
  color: var(--black);
  height: 35px;
  padding: 0 10px;
`;

const PriceBox = styled.div`
  text-align: center;
  margin: 12px 0 24px;
  padding: 0 10px;
`;

const Price = styled.span`
  font-family: MullerBold;
  font-size: 14px;
  line-height: 14px;
  color: var(--black);
`;

const Action = styled.div`
  font-family: MullerBold;
  font-size: 10px;
  line-height: 10px;
  color: var(--black);
  cursor: pointer;
  border: 1px solid var(--yellow);
  text-transform: uppercase;
  border-radius: 30px;
  text-align: center;
  padding: 15px 30px;
  transition: all 0.3s;
  width: calc(100% - 20px);
  margin: 0 auto;
  &:hover,
  &:active {
    background: var(--yellow);
    color: var(--white);
  }
`;

type Props = {
  product: ProductType;
  openModal?: Function;
};

const RelatedProducts: FC<Props> = ({ product, openModal }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const goToProduct = () => {
    if (openModal) {
      openModal(product);
    } else {
      history.push(`/${toLink(product.name)}`);
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 500);
    }
  };

  console.log(product);

  return (
    <Suspense fallback={<Loader />}>
      <Container>
        <Link>
          <Image className="lazyload"  data-src={product.image.split(",")[0]}></Image>
          <Title>
            {product.useKGS
              ? `${product.name} DE ${Number(product.weight)
                  .toFixed(2)
                  .replace(".", ",")} KGS APROX.`
              : product.name}
          </Title>
          <PriceBox>
            <Price>
              Bs. {product.price.toFixed(2).replace(".", ",")} {product.unit}
            </Price>
          </PriceBox>
        </Link>
        <Action onClick={goToProduct}>{t("product.related.see")}</Action>
      </Container>
    </Suspense>
  );
};

export default RelatedProducts;
