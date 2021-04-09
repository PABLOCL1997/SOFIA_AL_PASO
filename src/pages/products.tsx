import React, { Suspense, FC, useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { GET_CATEGORIES } from "../graphql/categories/queries";
import { GET_B2E_PRODUCTS, GET_PRODUCTS } from "../graphql/products/queries";
import {
  CategoryType,
  SubCategoryLvl3Type,
  SubCategoryLvl4Type
} from "../graphql/categories/type";
import { OrderColums } from "../graphql/products/type";
import { trackProductList } from "../utils/dataLayer";
import { toLink, fromLink } from "../utils/string";
import * as stringUtils from "../utils/string";
import { BREAKPOINT } from "../utils/constants";
import { PRODUCTS_TITLE } from "../meta";
import { GET_USER } from "../graphql/user/queries";
import DelayedWrapper from "../components/DelayedWrapper";
import { GET_BRANDS } from "../graphql/metadata/queries";
import { BreadWrap } from "../styled-components/ProductsStyles";
import BreadCrums from "../components/Breadcrums/Breadcrums";

const Loader = React.lazy(() =>
  import(/* webpackChunkName: "Loader" */ "../components/Loader")
);
const ProductList = React.lazy(() =>
  import(
    /* webpackChunkName: "ProductList" */ "../components/Products/ProductList"
  )
);
const FilterSideBar = React.lazy(() =>
  import(
    /* webpackChunkName: "FilterSideBar" */ "../components/Products/FilterSideBar"
  )
);
const CategoryBanner = React.lazy(() =>
  import(
    /* webpackChunkName: "CategoryBanner" */ "../components/Products/CategoryBanner"
  )
);

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
  const history = useHistory();
  const { category, subcategory, lastlevel } = useParams();
  const categoryName = useLocation().pathname
  const _category = categoryName ? categoryName.split('/').length >= 3 ? categoryName.split('/')[2] : "" : ""
  const _subcategory = categoryName ?  categoryName.split('/').length >= 4 ?categoryName.split('/')[3] : "": ""
  const _lastlevel = categoryName ? categoryName.split('/').length >= 5 ?categoryName.split('/')[4] : "" : ""

  const limit = 9;
  const query = new URLSearchParams(useLocation().search);

  const pageNumber = parseInt(String(query.get("p")));
  const [loader, setLoader] = useState(true);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(
    isNaN(pageNumber) || pageNumber == 1 ? 0 : (pageNumber - 1) * limit
  );
  const [search, setSearch] = useState(query.get("q"));
  const [brand, setBrand] = useState<any>(query.get("marca")?.split(",").map((brand: any) => `'${brand}'`).join(",") || null);
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState(OrderColums[0]);
  const [category_id, setCategoryId] = useState(0);
  const [idPriceList, setIdPriceList] = useState(0)
  
  const { data: userData } = useQuery(GET_USER, {});
  const { loading, data } = useQuery(GET_CATEGORIES, {
    fetchPolicy: "network-only",
    variables: {
      city: userData.userInfo.length ? userData.userInfo[0].cityKey : "SC",
    }
  });
  const [getBrands, { data: brands, loading: loadingBrands }] = useLazyQuery(GET_BRANDS,    {
    fetchPolicy: "network-only",
  });
  const [loadProductsFromListing] = useLazyQuery(GET_B2E_PRODUCTS, {
    fetchPolicy: "network-only",
    onCompleted: d => {
      trackProductList(d.productsB2B.rows)
      setProducts(d.productsB2B.rows)
      setTotal(d.productsB2B.count)
      setLoader(false)
    }
  }) 
  const [loadProducts, { loading: loadingProds }] = useLazyQuery(GET_PRODUCTS, {
    fetchPolicy: "network-only",
    onCompleted: d => {
      trackProductList(d.products.rows)
      setProducts(d.products.rows)
      setTotal(d.products.count)
      setLoader(false)

    }
  });
  const orderQuery = (column: string) => {
    setOrder(column);
  };

  useEffect(() => {
    // set title
    document.title = category ? `${PRODUCTS_TITLE} - ${fromLink(category)}` : PRODUCTS_TITLE;

    if (query.get("q") !== search) {
      setOffset(0);
      setSearch(query.get("q"));
    } 
    if (Number(query.get("p")) !== Number(page)) {
      setPage(Number(query.get("p")));
      let offset = Number(query.get("p")) - 1;
      setOffset((offset < 0 ? 0 : offset) * limit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    setLoader(true);

    if (data && data.categories) {
      let entity_id = null;

      let __category: any = data.categories.find(
        (row: CategoryType) => toLink(row.name) === toLink(category || _category) || ""
      );
      if (__category) {
        if (subcategory || _subcategory) {
          let __subcategory: any = __category.subcategories.find(
            (row: SubCategoryLvl3Type) =>
              toLink(row.name) === toLink(subcategory || _subcategory) || ""
          );
          if (__subcategory) {
            if (lastlevel || _lastlevel) {
              let __lastlevel: any = __subcategory.subcategories.find(
                (row: SubCategoryLvl4Type) =>
                  toLink(row.name) === toLink(lastlevel || _lastlevel) || ""
              );
              if (__lastlevel) entity_id = __lastlevel.entity_id;
            } else {
              entity_id = __subcategory.entity_id;
            }
          }
        } else {
          entity_id = __category.entity_id;
        }
      }
      // hay cat s3 o s4, pero no encontro ninguna (!entity_id)
      if (!entity_id && !!(category || subcategory || lastlevel)) {
        if(category !== "promociones" || _category !== "promociones")  {
          return history.replace("/404");
        }
      }
      if (entity_id && entity_id !== category_id) {
        setCategoryId(entity_id);
      } else if (!entity_id) {
        setCategoryId(0);
      }
      // always get brands before modify entity id
      getBrands({
        variables: {
          categoryId: entity_id || 0,
          city: userData.userInfo.length ? userData.userInfo[0].cityKey : "SC",      
        }
      });

      entity_id = search && search.length > 0 ? 0 : entity_id;

      if (userData?.userInfo?.length && userData?.userInfo[0] && userData.userInfo[0].idPriceList > 0) {
        loadProductsFromListing({
          variables: {
            category_id: entity_id || 0,
            limit,
            order,
            offset,
            search,
            city: userData.userInfo.length ? userData.userInfo[0].cityKey : "SC",
            id_price_list: String(userData.userInfo[0].idPriceList),
            onsale: (category || _category) === "promociones",
            brand: brand
          }
        })
      } else {
        loadProducts({
          variables: {
            category_id: entity_id || 0,
            limit,
            order,
            offset: offset,
            search: search,
            onsale: (category || _category) === "promociones",
            city: userData.userInfo.length
              ? userData?.userInfo[0]?.cityKey || "SC"
              : "SC",
            brand: brand
          }
        });
      }

      // set title
      document.title = category ? `${PRODUCTS_TITLE} - ${fromLink(category)}` : PRODUCTS_TITLE;
      setPage(1);
    }
    setTimeout(() => setLoader(false), 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, subcategory, lastlevel, data, order, search, brand, offset, idPriceList]);

  useEffect(() => {
    if(userData?.userInfo?.length && userData?.userInfo[0] && userData.userInfo[0].idPriceList >= 0) {
      if (userData.userInfo[0].idPriceList !== idPriceList) {
        setIdPriceList(userData.userInfo[0].idPriceList)
      }
    }
  }, [userData])


  return (
    <Suspense fallback={<Loader />}>
      <div className="main-container">
        <Container>

          <CategoryBanner isMobile={
                window.innerWidth < parseInt(BREAKPOINT.replace("px", ""))
          } category={category ? category : _category} />

          <BreadWrap>
            <BreadCrums
              isMobile={
                window.innerWidth < parseInt(BREAKPOINT.replace("px", ""))
              }
              alias={[
                {
                  oldName: "productos",
                  newName: "Tienda"
                }
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
                {data && brands && (
                  <FilterSideBar
                    categories={!loading && data ? data.categories : []}
                    count={total}
                    offset={offset}
                    limit={limit}
                    brands={brands}
                    order={order}
                    orderQuery={orderQuery}
                    setBrand={setBrand}
                  />
                )}
              </Col1>
              <Col2>
                {(loader || loadingProds) && (
                  <LoaderWrapper>
                    <img
                      src="/images/loader.svg"
                      width="50px"
                      height="50px"
                      alt="loader"
                    />
                  </LoaderWrapper>
                )}
                {!loader && !loadingProds && !loadingBrands && brands && (
                  <ProductList
                    brands={brands}
                    orderQuery={orderQuery}
                    products={products}
                    count={total}
                    offset={offset}
                    limit={limit}
                    parentOrder={order}
                  />
                )}
              </Col2>
            </Wrapper>
          </Container>
        </div>
      </DelayedWrapper>
    </Suspense>
  );
};

export default Products;
