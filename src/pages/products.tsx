import React, { Suspense, FC, useEffect } from "react";
import styled from "styled-components";
import { fromLink } from "../utils/string";
import { BREAKPOINT } from "../utils/constants";
import { PRODUCTS_TITLE } from "../meta";
import { trackProductList } from "../utils/dataLayer";
import DelayedWrapper from "../components/DelayedWrapper";
import { BreadWrap } from "../styled-components/ProductsStyles";
import BreadCrumbs from "../components/Breadcrumbs/Breadcrumbs";
import useCategory from "../hooks/useCategory";
import useProducts from "../hooks/useProducts";

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../components/Loader"));
const ProductList = React.lazy(() => import(/* webpackChunkName: "ProductList" */ "../components/Products/ProductList"));
const FilterSideBar = React.lazy(() => import(/* webpackChunkName: "FilterSideBar" */ "../components/Products/FilterSideBar"));
const CategoryBanner = React.lazy(() => import(/* webpackChunkName: "CategoryBanner" */ "../components/Products/CategoryBanner"));

const Wrapper = styled.div`
  /*  padding: var(--padding); */
  padding: 0;
  display: flex;
  @media screen and (max-width: ${BREAKPOINT}) {
    flex-direction: column;
    padding: 20px;
  }
`;

const Col1 = styled.div`
  /*   width: 250px; */
  width: 300px;
  margin-right: 16px;
  margin-top: -4px;

  @media screen and (max-width: ${BREAKPOINT}) {
    width: 100%;
    margin-right: 0;
  }
`;

const Col2 = styled.div`
  flex: 1;
`;

const LoaderWrapper = styled.div`
  background: white;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  border-radius: 20px;
  img {
    width: 50px;
  }
`;

export const Container = styled.div`
  padding: 0;
  max-width: 1200px;
  margin: 0 auto;
`;

type Props = {};
const Products: FC<Props> = () => {
  const { categories, category_id, category, subcategory, lastlevel } = useCategory();
  const { loading, products, total, limit, query, offset, order, search, brand, brands, setOrder, setBrand } = useProducts();

  useEffect(() => {
    // set title
    document.title = category ? `${PRODUCTS_TITLE} - ${fromLink(category)}` : PRODUCTS_TITLE;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category_id, category, subcategory, lastlevel, query, order, search, brand, offset]);

  useEffect(() => {
    if (products) {
      trackProductList(products)
    }
  }, [products]);

  return (
    <Suspense fallback={<Loader />}>
      <div className="main-container">
        <Container>
          <CategoryBanner isMobile={window.innerWidth < parseInt(BREAKPOINT.replace("px", ""))} />

          <BreadWrap>
            <BreadCrumbs
              isMobile={window.innerWidth < parseInt(BREAKPOINT.replace("px", ""))}
              alias={[
                {
                  oldName: "productos",
                  newName: "Tienda",
                },
              ]}
            />
          </BreadWrap>
        </Container>
      </div>
      <DelayedWrapper>
        <div className="main-container">
          <Container>
            <Wrapper>
              <Col1>
                {categories && categories.length && brands && (
                  <FilterSideBar categories={categories ? categories : []} count={total} offset={offset} limit={limit} brands={brands} order={order} orderQuery={setOrder} setBrand={setBrand} />
                )}
              </Col1>
              <Col2>
                {loading && (
                  <LoaderWrapper>
                    <img src="/images/loader.svg" width="50px" height="50px" alt="loader" />
                  </LoaderWrapper>
                )}
                {!loading && brands && <ProductList brands={brands} orderQuery={setOrder} products={products} count={total} offset={offset} limit={limit} parentOrder={order} />}
              </Col2>
            </Wrapper>
          </Container>
        </div>
      </DelayedWrapper>
    </Suspense>
  );
};

export default Products;
