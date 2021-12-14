import React, { Suspense, FC, useEffect, useState, useMemo } from 'react';
import { useQuery } from 'react-apollo';
import { useLocation, useParams } from "react-router-dom";
import styled from 'styled-components';
import ItemBoxMonitor from '../components/Product/ItemBoxMonitor';
import { GET_PRODUCTS } from '../graphql/products/queries';
import { ProductType } from '../graphql/products/type';
import useCategory from '../hooks/useCategory';


const Wrapper = styled.main`
    display: grid;

    // 3 columns, 2 rows
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, 1fr);

    column-gap: 5px;
    row-gap: 5px;
    padding: 20px 0 100px;
    width: 100vw;
    height: 100vh;
`

function useUrlQuery() {
  return new URLSearchParams(useLocation().search);
}

// shows a screen with products by city 
// it shouldn't have a header just the products in a grid 
const ProductsMonitor = () => {
  const isMonitors = true;
  const order = "position";
  const { city } = useParams();
  const { category_id } = useCategory(2);
  let query = useUrlQuery();


  const limit = 8
  const intervalMiliseconds = 5000; 

  const search = useMemo(() => {
    return query.get("q")
  }, [query])


  const [offset, setOffset] = useState(0);
  const { data } = useQuery(GET_PRODUCTS, {
      fetchPolicy: "network-only",
      variables: {
        city,
        offset,
        limit,
        category_id,
        onsale: false,
        order,
        search,
        isMonitors
      },
      skip: !category_id
  }); 

  const total: number = useMemo(() => {
    return data?.products?.count;
  }, [data])

  useEffect(() => {
    const interval = setInterval(() => {
        // if offset value is less than the total minus the limit
        // then increment the offset by the limit
        // otherwise, reset the offset to 0

        setOffset(offset => offset < (total - limit) ? offset + limit : 0);
    }, intervalMiliseconds);
    return () => clearInterval(interval);
  }, [data, total]);

  return (
    <Wrapper>
        {data?.products?.rows?.length > 0 ?
            data.products.rows.map((product: ProductType, index: number) => <ItemBoxMonitor product={product} />)
            : <div>Cargando...</div>
        }
    </Wrapper>
 

  )

}

export default ProductsMonitor;