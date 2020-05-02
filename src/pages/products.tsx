import React, { Suspense, FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useLocation } from "react-router-dom";
import { user } from '../utils/store';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import { GET_CATEGORIES } from '../graphql/categories/queries';
import { GET_PRODUCTS } from '../graphql/products/queries';
import { CategoryType } from '../graphql/categories/type';
import { OrderColums } from '../graphql/products/type';
import { toLink, fromLink } from '../utils/string';
import { PRODUCTS_TITLE } from '../meta';

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */'../components/Loader'));
const ProductList = React.lazy(() => import(/* webpackChunkName: "ProductList" */'../components/Products/ProductList'));
const FilterSideBar = React.lazy(() => import(/* webpackChunkName: "FilterSideBar" */'../components/Products/FilterSideBar'));

const Wrapper = styled.div`
    padding: var(--padding);
    display: flex;
`

const Col1 = styled.div`
    width: 250px;
    margin-right: 16px;
`

const Col2 = styled.div`
    flex: 1;
`

type Props = {}
const Products: FC<Props> = () => {
    const limit = 9;
    const _user = user.get();
    const { category } = useParams();
    const query = new URLSearchParams(useLocation().search);

    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [offset, setOffset] = useState(0);
    const [search, setSearch] = useState(query.get('q'));
    const [page, setPage] = useState(1);
    const [order, setOrder] = useState(OrderColums[0]);
    const [category_id, setCategoryId] = useState(0);

    const { loading, data } = useQuery(GET_CATEGORIES, {});
    const [loadProducts] = useLazyQuery(GET_PRODUCTS, {
        variables: { category_id, limit, order, offset: offset, search: search, city: _user.address ? _user.address.key : '' },
        fetchPolicy: 'cache-and-network',
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
        let __category = data.categories.find((row: CategoryType) => toLink(row.name) === toLink(category || ''));
        if (__category && __category.entity_id !== category_id) {
            setTitle();
            setCategoryId(__category.entity_id);
            setSearch('');
            setOffset(0);
            setPage(1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category]);

    return (
        <Suspense fallback={<Loader />}>
            <div className="main-container">
                <Wrapper>
                    <Col1>
                        <FilterSideBar categories={!loading && data ? data.categories : []} category={category} count={total} />
                    </Col1>
                    <Col2>
                        <ProductList orderQuery={orderQuery} products={products} count={total} />
                    </Col2>
                </Wrapper>
            </div>
        </Suspense>
    );
}

export default Products;
