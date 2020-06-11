import React, { Suspense, FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useLocation } from "react-router-dom";
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import { GET_CATEGORIES } from '../graphql/categories/queries';
import { GET_PRODUCTS } from '../graphql/products/queries';
import { CategoryType, SubCategoryLvl3Type, SubCategoryLvl4Type } from '../graphql/categories/type';
import { OrderColums } from '../graphql/products/type';
import { toLink, fromLink } from '../utils/string';
import { BREAKPOINT } from '../utils/constants';
import { PRODUCTS_TITLE } from '../meta';
import { GET_USER } from '../graphql/user/queries';
import DelayedWrapper from '../components/DelayedWrapper';

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */'../components/Loader'));
const ProductList = React.lazy(() => import(/* webpackChunkName: "ProductList" */'../components/Products/ProductList'));
const FilterSideBar = React.lazy(() => import(/* webpackChunkName: "FilterSideBar" */'../components/Products/FilterSideBar'));
const CategoryBanner = React.lazy(() => import(/* webpackChunkName: "CategoryBanner" */'../components/Products/CategoryBanner'));

const Wrapper = styled.div`
    padding: var(--padding);
    display: flex;
    @media screen and (max-width: ${BREAKPOINT}) {
        flex-direction: column;
        padding: 20px;
    }
`

const Col1 = styled.div`
    width: 250px;
    margin-right: 16px;
    @media screen and (max-width: ${BREAKPOINT}) {
        width: 100%;
        margin-right: 0;
    }
`

const Col2 = styled.div`
    flex: 1;
`

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
`

type Props = {}
const Products: FC<Props> = () => {
    const limit = 9;
    const { category, subcategory, lastlevel } = useParams();
    const query = new URLSearchParams(useLocation().search);

    const [loader, setLoader] = useState(true);
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [offset, setOffset] = useState(0);
    const [search, setSearch] = useState(query.get('q'));
    const [page, setPage] = useState(1);
    const [order, setOrder] = useState(OrderColums[0]);
    const [category_id, setCategoryId] = useState(0);

    const { loading, data } = useQuery(GET_CATEGORIES, {});
    const { data: userData } = useQuery(GET_USER, {});
    const [loadProducts, { loading: loadingProds }] = useLazyQuery(GET_PRODUCTS, {
        variables: { category_id, limit, order, offset: offset, search: search, city: userData.userInfo.length ? userData.userInfo[0].cityKey : '' },
        fetchPolicy: 'network-only',
        onCompleted: (d) => {
            setProducts(d.products.rows)
            setTotal(d.products.count)
        }
    });

    const orderQuery = (column: string) => {
        setOrder(column)
    }

    const setTitle = () => {
        let title = PRODUCTS_TITLE;
        if (category) title += ` - ${fromLink(category)}`;
        document.title = title;
    };

    useEffect(() => {
        setTitle();
        loadProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (query.get('q') !== search) {
            setOffset(0);
            setSearch(query.get('q'));
        } else if (Number(page) !== Number(query.get('p'))) {
            setPage(Number(query.get('p')));
            let offset = Number(query.get('p')) - 1;
            setOffset((offset < 0 ? 0 : offset) * limit);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]);

    useEffect(() => {
        setLoader(true);
        if (data && data.categories) {
            let entity_id = null;

            let __category: any = data.categories.find((row: CategoryType) => toLink(row.name) === toLink(category || ''));
            if (__category) {
                if (subcategory) {
                    let __subcategory: any = __category.subcategories.find((row: SubCategoryLvl3Type) => toLink(row.name) === toLink(subcategory || ''));
                    if (__subcategory) {
                        if (lastlevel) {
                            let __lastlevel: any = __subcategory.subcategories.find((row: SubCategoryLvl4Type) => toLink(row.name) === toLink(lastlevel || ''));
                            if (__lastlevel)
                                entity_id = __lastlevel.entity_id;
                        } else {
                            entity_id = __subcategory.entity_id;
                        }
                    }
                } else {
                    entity_id = __category.entity_id;
                }
            }

            if (entity_id && entity_id !== category_id) {
                setCategoryId(entity_id);
            } else if (!entity_id) {
                setCategoryId(0);
            }
            setTitle();
            setSearch('');
            setOffset(0);
            setPage(1);
        }
        setTimeout(() => setLoader(false), 500);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category, subcategory, lastlevel]);

    return (
        <Suspense fallback={<Loader />}>
            <DelayedWrapper>
                <div className="main-container">
                    {(category === 'mascotas' || category === 'embutidos-premium') && <CategoryBanner category={category} />}
                    <Wrapper>
                        <Col1>
                            <FilterSideBar categories={!loading && data ? data.categories : []} category={category} subcategory={subcategory} lastlevel={lastlevel} count={total} />
                        </Col1>
                        <Col2>
                            {(loader || loadingProds) && <LoaderWrapper><img src="/images/loader.svg" alt="loader" /></LoaderWrapper>}
                            {!loader && !loadingProds && <ProductList orderQuery={orderQuery} products={products} count={total} />}
                        </Col2>
                    </Wrapper>
                </div>
            </DelayedWrapper>
        </Suspense>
    );
}

export default Products;
