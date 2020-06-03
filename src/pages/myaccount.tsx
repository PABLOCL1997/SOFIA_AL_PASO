import React, { Suspense, FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useHistory } from "react-router-dom";
import { MY_ACCOUNT_TITLE } from '../meta';
import DelayedWrapper from '../components/DelayedWrapper';
import { BREAKPOINT } from '../utils/constants';
import { token } from '../utils/store';

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */'../components/Loader'));
const Sidebar = React.lazy(() => import(/* webpackChunkName: "Sidebar" */'../components/MyAccount/Sidebar'));
const Details = React.lazy(() => import(/* webpackChunkName: "Details" */'../components/MyAccount/Details'));
const Orders = React.lazy(() => import(/* webpackChunkName: "Orders" */'../components/MyAccount/Orders'));

const Wrapper = styled.div`
    margin: 40px 0;
    padding: var(--padding);
    display:flex;
    flex-direction: row;
    align-items: flex-start;
    @media screen and (max-width: ${BREAKPOINT}) {
        flex-direction: column;
        padding: 20px;
        margin: 0;
    }
`

const SidebarContainer = styled.div`
    background: var(--white);
    box-shadow: 0px 6px 74px rgba(0, 0, 0, 0.06);
    border-radius: 20px;
    position: relative;
    left: 100px;
    z-index: 0;
    width: 350px;
    @media screen and (max-width: ${BREAKPOINT}) {
        width: 100%;
        left: 0;
    }
`

const Container = styled.div`
    background: linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(251,252,252,1) 30%, rgba(250,250,250,1) 100%);
    box-shadow: 7px 15px 84px rgba(0, 0, 0, 0.07);
    border-radius: 20px;
    padding: 30px 40px;
    width: calc(100% - 500px);
    margin-left: 50px;
    position: relative;
    z-index: 1;

    @media screen and (max-width: ${BREAKPOINT}) {
        width: 100%;
        margin-left: 0;
        margin-top: 20px;
    }
`

type Props = {}
const MyAccount: FC<Props> = () => {
    const history = useHistory();
    const { pathname } = useLocation();
    const [showDetails, setShowDetails] = useState(pathname.indexOf('ordenes') < 0);

    useEffect(() => {
        document.title = MY_ACCOUNT_TITLE;
        if (!token.get()) history.push('/')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setShowDetails(pathname.indexOf('ordenes') < 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    return (
        <Suspense fallback={<Loader />}>
            <DelayedWrapper>
                <Wrapper>
                    <SidebarContainer>
                        <Sidebar></Sidebar>
                    </SidebarContainer>
                    <Container>
                        {showDetails && <Details />}
                        {!showDetails && <Orders />}
                    </Container>
                </Wrapper>
            </DelayedWrapper>
        </Suspense>
    );
}

export default MyAccount;
