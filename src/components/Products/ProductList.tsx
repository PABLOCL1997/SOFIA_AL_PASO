import React, { FC, Suspense, useState, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { ProductType, OrderColums } from "../../graphql/products/type";
import { toLink, fromLink } from "../../utils/string";
import { BREAKPOINT } from "../../utils/constants";

const Loader = React.lazy(() =>
  import(/* webpackChunkName: "Loader" */ "../Loader")
);
const Cta = React.lazy(() => import(/* webpackChunkName: "Cta" */ "../Cta"));
const ItemBox = React.lazy(() =>
  import(/* webpackChunkName: "ItemBox" */ "../ItemBox")
);
const Search = React.lazy(() =>
  import(/* webpackChunkName: "Search" */ "../Images/Search")
);
const PagerArrowLeft = React.lazy(() =>
  import(
    /* webpackChunkName: "PagerArrowLeftPagerArrowLeft" */ "../Images/PagerArrowLeft"
  )
);
const PagerArrowRight = React.lazy(() =>
  import(/* webpackChunkName: "PagerArrowRight" */ "../Images/PagerArrowRight")
);
const Chevron = React.lazy(() =>
  import(/* webpackChunkName: "Chevron" */ "../Images/Chevron")
);
const Product = React.lazy(() =>
  import(/* webpackChunkName: "Product" */ "../../pages/product")
);

const Container = styled.div``;

const Toolbox = styled.div`
  display: flex;
  align-items: center;
  @media screen and (max-width: ${BREAKPOINT}) {
    margin-top: 30px;
    div:first-child {
      margin-right: 0;
    }
    div:last-child {
      display: none;
    }
  }
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  flex: 1;
  background: var(--f-gray);
  border-radius: 44px;
  margin-right: 40px;
  svg {
    position: absolute;
    left: 20px;
  }
  input {
    background: none;
    border: 0;
    padding: 15px 50px;
    font-family: MullerBold;
    font-size: 14px;
    line-height: 14px;
    display: flex;
    align-items: center;
    letter-spacing: 0.01em;
    color: var(--black);
    flex: 1;
    &::placeholder {
      color: var(--black);
    }
  }
  button {
    padding: 14px 50px;
    span {
      font-family: MullerBold;
      font-size: 12px;
      line-height: 12px;
      text-transform: uppercase;
    }
  }
`;

const SelectBox = styled.div`
  position: relative;
  z-index: 2;
`;

const Select = styled.div`
  border: 1px solid var(--red);
  box-sizing: border-box;
  border-radius: 44px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  span {
    font-size: 14px;
    line-height: 14px;
    letter-spacing: 0.01em;
    color: var(--font);
  }
  b {
    font-family: MullerBold;
    font-size: 14px;
    line-height: 14px;
    letter-spacing: 0.01em;
    color: var(--black);
    margin: 0 8px;
  }
`;

const List = styled.ul`
  position: absolute;
  background: var(--white);
  box-shadow: 0px 6px 74px rgba(0, 0, 0, 0.06);
  width: 100%;
  border-radius: 20px;
  padding: 25px 0 0;
`;

const Item = styled.li<{ key: number }>`
  padding: 15px 30px;
  cursor: pointer;
  font-family: MullerBold;
  font-size: 12px;
  line-height: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  &:hover {
    color: var(--red);
  }
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  @media screen and (max-width: ${BREAKPOINT}) {
    grid-template-columns: 1fr;
  }
`;

const Pager = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
  flex-wrap: wrap;
`;
Pager.displayName = 'Pager'

const PageArrow = styled.a<{ allowed: boolean }>`
  opacity: ${props => (props.allowed ? "1" : ".3")};
  margin: 0 10px;
  cursor: ${props => (props.allowed ? "pointer" : "default")};
`;
PageArrow.displayName = 'PageArrow'

const Page = styled.a<{ selected: boolean }>`
  font-family: ${props => (props.selected ? "MullerBold" : "MullerRegular")};
  font-size: 12px;
  line-height: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${props => (props.selected ? "var(--red)" : "var(--font)")};
  margin: 5px;
  cursor: ${props => (props.selected ? "default" : "pointer")};
`;
Page.displayName = 'Page'

const ProductModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(255, 255, 255, 0.8);
  z-index: 3;
  & > div {
    margin: 30px auto;
    box-shadow: 0 0 5px #ccc;
    background: white;
    height: calc(100vh - 60px);
    width: calc(100% - 100px);
    max-width: 1100px;
    overflow: auto;
    border-radius: 20px;
    .main-container {
      & > div {
        padding: 30px 0;
      }
      .wrapper-related {
        padding: 30px 0;
      }
    }
  }
`;

const NoResults = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--font);
  min-height: 400px;
  font-family: MullerMedium;
  font-size: 16px;
  line-height: 1.5em;
  letter-spacing: 0.1em;
  max-width: 320px;
  text-align: center;
  margin: 0 auto;
`;

type Props = {
  products: Array<ProductType>;
  count: number;
  orderQuery: Function;
  parentOrder: string;
};

const ProductList: FC<Props> = ({
  products,
  count,
  orderQuery,
  parentOrder
}) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const query = new URLSearchParams(useLocation().search);
  const history = useHistory();
  const [oldUrl, setOldUrl] = useState("");
  const [search, setSearch] = useState(query.get("q"));
  const [page, setPage] = useState(query.get("p") ? Number(query.get("p")) : 1);
  const [openOrder, setOpenOrder] = useState(false);
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState<ProductType | any>({});

  const selectItem = (item: string) => {
    setOpenOrder(false);
    orderQuery(item);
  };

  const doSearch = () => {
    history.push({
      pathname: "/productos",
      search: `q=${toLink(search)}`
    });
  };

  const move = (fwd: boolean) => {
    if (fwd && page < Math.ceil(count / 9)) return changePage(page + 1);
    else if (!fwd && page > 1) return changePage(page - 1);
  };

  const changePage = (page: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    let search = "?";
    if (query.get("q")) search += `q=${query.get("q")}&`;
    search += `p=${page}`;
    return `${pathname}${search}`
    // history.push(`${pathname}${search}`);
    // setPage(page);
  };

  const openModal = (product: ProductType) => {
    setProduct(product);
    window.history.replaceState("", "", `/${toLink(product.name)}`);
    setOpen(true);
  };

  const getOldUrl = () => {
    let _search = "?";
    if (search) _search += `q=${search}&`;
    _search += `p=${page}`;
    return `${pathname}${_search}`;
  };

  useEffect(() => {
    setOldUrl(getOldUrl());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  useEffect(() => {
    setOldUrl(getOldUrl());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Suspense fallback={<Loader />}>
      <Container>
        <Toolbox>
          <InputGroup>
            <Search />
            <input
              type="search"
              value={fromLink(search)}
              onKeyUp={evt => {
                if (evt.keyCode === 13) doSearch();
              }}
              onChange={evt => setSearch(evt.target.value)}
              placeholder={t("products.product_list.search_product")}
            />
            <Cta
              filled={true}
              action={doSearch}
              text={t("products.product_list.search")}
            />
          </InputGroup>
          <SelectBox>
            <Select onClick={() => setOpenOrder(!openOrder)}>
              <span>{t("products.product_list.order_by")}</span>
              <b>{t("products.product_list." + parentOrder)}</b>
              <Chevron />
            </Select>
            {openOrder && (
              <List>
                {OrderColums.map((item: string, index: number) => (
                  <Item key={index} onClick={() => selectItem(item)}>
                    {t("products.product_list." + item)}
                  </Item>
                ))}
              </List>
            )}
          </SelectBox>
        </Toolbox>
        {!!products.length && (
          <Grid>
            {products.map((product: ProductType) => (
              <ItemBox
                key={product.entity_id}
                product={product}
              />
            ))}
          </Grid>
        )}
        {!products.length && (
          <NoResults>{t("products.product_list.no_results")}</NoResults>
        )}
        {!!products.length && count > 9 && (
          <Pager>
            <PageArrow
              onClick={() => {}}
              allowed={page > 1}
              href={move(false)}
            >
              <PagerArrowLeft />
            </PageArrow>
            {[...Array(Math.ceil(count / 9))].map((v: any, index: number) => (
              <Page
                selected={page === index + 1}
                key={index}
                onClick={() => {  }}
                href={changePage(index + 1)}
              >
                {index + 1}
              </Page>
            ))}
            <PageArrow
              onClick={() => {}}
              allowed={page < Math.ceil(count / 9)}
              href={move(true)}
            >
              <PagerArrowRight />
            </PageArrow>
          </Pager>
        )}
        {open && (
          <ProductModal>
            <div className="product-modal">
              <Product
                closeModal={() => setOpen(false)}
                oldUrl={oldUrl}
                inlineProdname={toLink(product.name)}
              />
            </div>
          </ProductModal>
        )}
      </Container>
    </Suspense>
  );
};

export default ProductList;
