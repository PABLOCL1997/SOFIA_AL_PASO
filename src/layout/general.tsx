import React, { FC, Suspense, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import styled from 'styled-components';
import { BREAKPOINT } from '../utils/constants';

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */'../components/Loader'));
const Error = React.lazy(() => import(/* webpackChunkName: "Error" */'../components/Error'));
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

    useEffect(() => {
        let url = history.location.pathname;
        const unlisten = history.listen(() => {
            let { location: { pathname } } = history;
            if (pathname !== url && (pathname === '/' || pathname.indexOf('/productos') >= 0)) {
                url = pathname;
                window.scrollTo(0, 0);
            }
        });
        return () => {
            unlisten();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Suspense fallback={<Loader />}>
            <Wrapper>
                <Header />
                {children}
                <Footer />
                <Error />
            </Wrapper>
        </Suspense>
    );
}

export default LayoutGeneral;
