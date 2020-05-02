import React, { Suspense, FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from "react-router-dom";
import { PRODUCT_TITLE } from '../meta';
import { fromLink } from '../utils/string';

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */'../components/Loader'));

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
    const { product } = useParams();

    useEffect(() => {
        document.title = `${PRODUCT_TITLE} ${fromLink(product || '')}`
    }, []);

    return (
        <Suspense fallback={<Loader />}>
            <div className="main-container">
                <Wrapper>
                    <Col1>
                        holis
                    </Col1>
                    <Col2>
                        chau
                    </Col2>
                </Wrapper>
            </div>
        </Suspense>
    );
}

export default Products;
