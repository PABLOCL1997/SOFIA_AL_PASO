import React, { FC, Suspense, useState, useEffect } from "react";
import styled from "styled-components";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { Link, useHistory } from "react-router-dom";
import { CategoryType } from "../../graphql/categories/type";
import { GET_B2E_PRODUCTS, GET_PRODUCTS } from "../../graphql/products/queries";
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

const SectionWrapper = styled.div`
  margin-bottom: 88px;
  @media screen and (max-width: ${BREAKPOINT}) {
    margin-bottom: 30px;
  }
`; 
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

type Props = {
};

const CategorySlider: FC<Props> = () => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<number>(0);
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [idPriceList, setIdPriceList] = useState(0)
  const [city, setCity] = useState("SC")
  const { data: userData } = useQuery(GET_USER, {});


  const { loading, data } = useQuery(GET_CATEGORIES, {
    variables: {
      city: userData.userInfo.length ? userData.userInfo[0].cityKey : "SC",
    }
  });
  const [loadProductsFromListing] = useLazyQuery(GET_B2E_PRODUCTS, {
    fetchPolicy:"network-only",
    onCompleted: d => setProducts(d.productsB2B.rows)
  }) 
  const [loadProducts,{ loading: loadingProducts }] = useLazyQuery(GET_PRODUCTS, {
    fetchPolicy:"network-only",
    onCompleted: d => setProducts(d.products.rows)
  });

  const seeAll = () => {
    if (selected === 0) {
      return `/productos`;
    } else {
      return `/productos/${toLink(
          data.categories.find(
            (row: CategoryType) => row.entity_id === selected
          ).name
        )}`
    }
  };

  const selectCategory = (index: number) => {
    setSelected(index);
    setOpen(false);
  };

  useEffect(() => {
    if (userData?.userInfo?.length && userData?.userInfo[0] && userData.userInfo[0].idPriceList > 0) {
      loadProductsFromListing({
        variables: {
          category_id: selected,
          limit: 9,
          offset: 0,
          city,
          id_price_list: String(userData.userInfo[0].idPriceList),
        }
      })
    } else {
      loadProducts({
        variables: {
          category_id: selected,
          limit: 9,
          offset: 0,
          city
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, idPriceList, city]);

  useEffect(() => {
    if(userData?.userInfo?.length && userData?.userInfo[0] && userData.userInfo[0].idPriceList >= 0) {
      if (userData.userInfo[0].idPriceList !== idPriceList) {
        setIdPriceList(userData.userInfo[0].idPriceList)
      }
    }

    if(userData.userInfo.length && userData.userInfo[0].cityKey) {
      if (userData.userInfo[0].cityKey !== city) {
        setCity(userData.userInfo[0].cityKey)
      }
    }

  }, [userData])

  const inStockProducts = () => {
    return products.filter((p: { stock: number; }) => p.stock > 0);
  };

  let categoryName = t("homepage.categoryslider.all");
  if (selected > 0) {
    categoryName = data.categories.find(
      (row: CategoryType) => row.entity_id === selected
    ).name;
  }

  return (
    <SectionWrapper>
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
            {/* chevron */}
            <svg width="11" height="6" viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1.38452L5.5 5.077L10 1.38452" stroke="#808080" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
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
          <ProductSlider products={inStockProducts()} />
        )}
        <CtaWrapper>
          <Link to={seeAll()}>
          <Cta
            action={() => {}}
            text={t("homepage.categoryslider.seeall")}
            filled={true}
          />
          </Link>
        </CtaWrapper>
    </SectionWrapper>
  );
};

export default CategorySlider;
