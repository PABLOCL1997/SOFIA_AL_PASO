import React, { FC, Suspense, useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
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
    const history = useHistory();
    let url = history.location.pathname;

    useEffect(() => {
        const unlisten = history.listen(() => {
            let { location: { pathname } } = history;
            console.log(pathname, url);
            if (pathname !== url && (pathname === '/' || pathname.indexOf('/productos') >= 0)) {
                url = pathname;
                window.scrollTo(0, 0);
            }
        });
        return () => {
            unlisten();
        }
    }, []);

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
