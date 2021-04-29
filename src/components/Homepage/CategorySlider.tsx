import React, { FC, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { CategoryType } from "../../graphql/categories/type";
import { useTranslation } from "react-i18next";
import { toLink } from "../../utils/string";
import { BREAKPOINT } from "../../utils/constants";
import useCategory from "../../hooks/useCategory";
import useProducts from "../../hooks/useProducts";

const ProductSlider = React.lazy(() => import(/* webpackChunkName: "ProductSlider" */ "./ProductSlider"))
const Cta = React.lazy(() => import(/* webpackChunkName: "Cta" */ "../Cta"))

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
  const { categories, loading: loadingCat } = useCategory()
  const { products, loading: loadingProds, setCategoryId } = useProducts()
  const [selected, setSelected] = useState<CategoryType | number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const [categoryName, setCategoryName] = useState<string>(t("homepage.categoryslider.all"))
  const [link, setLink] = useState<string>('/productos')


  const selectCategory = (index: number, cat?: CategoryType) => {
    setSelected(index);
    setCategoryId(index)
    setOpen(false);
    if (!cat) {
      setCategoryName(t("homepage.categoryslider.all"))
      setLink('/productos')
    } else {
      setLink(`/productos/${toLink(cat.name)}`)
    }
  };

  return (
    <SectionWrapper>
        <CategoryList>
          <Category onClick={() => selectCategory(0)} selected={selected === 0}>
            {t("homepage.categoryslider.all")}
          </Category>
          {!loadingCat &&
            categories.map((row: CategoryType) => (
              <Category
                onClick={() => selectCategory(row.entity_id, row)}
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
              {!loadingCat &&
                categories.map((row: CategoryType) => (
                  <CategoryItemMobile
                    onClick={() => selectCategory(row.entity_id, row)}
                    selected={selected === row.entity_id}
                    key={row.entity_id}
                  >
                    {row.name}
                  </CategoryItemMobile>
                ))}
            </CategoryMobileList>
          )}
        </CategoryMobile>
        {loadingProds && (
          <LoaderWrapper>
            <img src="/images/loader.svg" alt="loader" />
          </LoaderWrapper>
        )}
        {!loadingProds && !!products.length && (
          <ProductSlider products={products} />
        )}
        <CtaWrapper>
          <Link to={link}>
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
