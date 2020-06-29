import React, { FC, Suspense, useState, useEffect } from "react";
import styled from "styled-components";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { useHistory } from "react-router-dom";
import { CategoryType } from "../../graphql/categories/type";
import { GET_PRODUCTS } from "../../graphql/products/queries";
import { GET_CATEGORIES } from "../../graphql/categories/queries";
import { useTranslation } from "react-i18next";
import { toLink } from "../../utils/string";
import { BREAKPOINT } from "../../utils/constants";
import { GET_USER } from "../../graphql/user/queries";

const Loader = React.lazy(() =>
  import(/* webpackChunkName: "Loader" */ "../Loader")
);
const ProductSlider = React.lazy(() =>
  import(/* webpackChunkName: "ProductSlider" */ "./ProductSlider")
);
const Cta = React.lazy(() => import(/* webpackChunkName: "Cta" */ "../Cta"));
const Chevron = React.lazy(() =>
  import(/* webpackChunkName: "Chevron" */ "../Images/Chevron")
);

const CategoryList = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  @media screen and (max-width: ${BREAKPOINT}) {
    display: none;
  }
`;

const Category = styled.div<{ selected: boolean; key?: number }>`
  position: relative;
  border: 1px solid
    ${(props) => (props.selected ? "var(--yellow)" : "transparent")};
  cursor: pointer;
  border-radius: 30px;
  padding: 25px 50px;
  font-size: 14px;
  line-height: 0;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: ${(props) => (props.selected ? "var(--red)" : "var(--black)")};
  transition: all 0.2s linear;
  margin: 0 10px 20px;
  &:hover {
    border: 1px solid var(--yellow);
    color: var(--red);
  }
  @media screen and (max-width: ${BREAKPOINT}) {
    display: flex;
    align-items: center;
    width: calc(100% - 40px);
    margin-left: 20px;
    position: relative;
    z-index: 2;
    span {
      flex: 1;
    }
  }
`;

const CategoryMobile = styled.div`
  position: relative;
  display: none;
  @media screen and (max-width: ${BREAKPOINT}) {
    display: block;
  }
`;

const CategoryMobileList = styled.div`
  width: calc(100% - 40px);
  margin-left: 20px;
  background: var(--white);
  box-shadow: 0px 6px 74px rgba(0, 0, 0, 0.06);
  border-radius: 27px;
  margin-top: -65px;
  padding-top: 65px;
  position: absolute;
  z-index: 1;
`;

const CategoryItemMobile = styled.div<{ selected: boolean; key?: number }>`
  font-family: MullerBold;
  font-size: 12px;
  line-height: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--black);
  border: 1px solid
    ${(props) => (props.selected ? "var(--yellow)" : "transparent")};
  color: ${(props) => (props.selected ? "var(--red)" : "var(--black)")};
  cursor: pointer;
  border-radius: 30px;
  padding: 10px 40px;
  margin-bottom: 20px;
`;

const CtaWrapper = styled.div`
  text-align: center;
  margin-top: 30px;
  button {
    padding: 13px 80px;
    text-transform: uppercase;
  }
  @media screen and (max-width: ${BREAKPOINT}) {
    margin: 50px 0;
  }
`;

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 470px;
  img {
    width: 40px;
  }
`;

type Props = {};

const CategorySlider: FC<Props> = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [selected, setSelected] = useState<number>(0);
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const { loading, data } = useQuery(GET_CATEGORIES, {});
  const { data: userData } = useQuery(GET_USER, {});

  const [
    loadProducts,
    { loading: loadingProducts, data: productsData }
  ] = useLazyQuery(GET_PRODUCTS, {
    variables: {
      category_id: selected,
      limit: 8,
      offset: 0,
      city: userData.userInfo.length ? userData.userInfo[0].cityKey : ""
    },
    fetchPolicy: "cache-and-network"
  });

  const seeAll = () => {
    if (selected === 0) {
      history.push(`/productos/`);
    } else {
      history.push(
        `/productos/${toLink(
          data.categories.find(
            (row: CategoryType) => row.entity_id === selected
          ).name
        )}`
      );
    }
  };

  const selectCategory = (index: number) => {
    setSelected(index);
    setOpen(false);
  };

  useEffect(() => {
    if (productsData) {
      setProducts([]);
      setTimeout(() => {
        setProducts(productsData.products.rows);
      }, 1000);
    }
  }, [productsData]);

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  let categoryName = t("homepage.categoryslider.all");
  if (selected > 0) {
    categoryName = data.categories.find(
      (row: CategoryType) => row.entity_id === selected
    ).name;
  }

  return (
    <Suspense fallback={<Loader />}>
      <div className="main-container">
        <CategoryList>
          <Category onClick={() => setSelected(0)} selected={selected === 0}>
            {t("homepage.categoryslider.all")}
          </Category>
          {!loading &&
            data &&
            data.categories.map((row: CategoryType) => (
              <Category
                onClick={() => setSelected(row.entity_id)}
                selected={selected === row.entity_id}
                key={row.entity_id}
              >
                {row.name}
              </Category>
            ))}
        </CategoryList>
        <CategoryMobile>
          <Category onClick={() => setOpen(true)} selected={true}>
            <span>{categoryName}</span>
            <Chevron />
          </Category>
          {open && (
            <CategoryMobileList>
              <CategoryItemMobile
                onClick={() => selectCategory(0)}
                selected={selected === 0}
              >
                {t("homepage.categoryslider.all")}
              </CategoryItemMobile>
              {!loading &&
                data &&
                data.categories.map((row: CategoryType) => (
                  <CategoryItemMobile
                    onClick={() => selectCategory(row.entity_id)}
                    selected={selected === row.entity_id}
                    key={row.entity_id}
                  >
                    {row.name}
                  </CategoryItemMobile>
                ))}
            </CategoryMobileList>
          )}
        </CategoryMobile>
        {(loadingProducts || !products.length) && (
          <LoaderWrapper>
            <img src="/images/loader.svg" alt="loader" />
          </LoaderWrapper>
        )}
        {!loadingProducts && !!products.length && (
          <ProductSlider products={products} />
        )}
        <CtaWrapper>
          <Cta
            action={seeAll}
            text={t("homepage.categoryslider.seeall")}
            filled={true}
          />
        </CtaWrapper>
      </div>
    </Suspense>
  );
};

export default CategorySlider;
