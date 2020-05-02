import React, { Suspense, FC, useEffect } from 'react';
import styled from 'styled-components';
import { CHECKOUT_TITLE } from '../meta';

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */'../components/Loader'));

const Wrapper = styled.div`
    padding: var(--padding);
`

type Props = {}
const Checkout: FC<Props> = () => {
    useEffect(() => {
        document.title = CHECKOUT_TITLE;
    }, [])

    return (
        <Suspense fallback={<Loader />}>
            <Wrapper>
                Checkout
            </Wrapper>
        </Suspense>
    );
}

export default Checkout;
