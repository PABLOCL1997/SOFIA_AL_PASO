import React, { FC, Suspense } from 'react';
import styled from 'styled-components';
import { BREAKPOINT } from '../utils/constants';

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */'../components/Loader'));
const Header = React.lazy(() => import(/* webpackChunkName: "Header" */'../components/Header'));
const Footer = React.lazy(() => import(/* webpackChunkName: "Footer" */'../components/Footer'));

const Wrapper = styled.div`
    margin: 0;
    padding: 113px 0 0;
    @media screen and (max-width: ${BREAKPOINT}) {
        padding: 0;
    }
`

type Props = {}

const LayoutGeneral: FC<Props> = ({ children }) => {

    return (
        <Suspense fallback={<Loader />}>
            <Wrapper>
                <Header />
                {children}
                <Footer />
            </Wrapper>
        </Suspense>
    );
}

export default LayoutGeneral;
