import React, { FC, Suspense } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useQuery } from "@apollo/react-hooks";
import { DETAILS } from '../../graphql/user/queries';
import { Link, useLocation } from "react-router-dom";

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */'../Loader'));
const ProfileIcon = React.lazy(() => import(/* webpackChunkName: "ProfileIcon" */'../Images/ProfileIcon'));
const History = React.lazy(() => import(/* webpackChunkName: "History" */'../Images/History'));

const Name = styled.h2`
    font-family: MullerMedium;
    font-size: 16px;
    line-height: 16px;
    letter-spacing: 0.01em;
    color: var(--red);
    padding: 26px;
    margin-bottom: 40px;
`

const Menu = styled.ul`
    margin-bottom: 30px;
`

const Item = styled.li<{ active: boolean }>`
    display: flex;
    align-items: center;
    padding: 8px 26px;
    margin: 10px 0;
    border-left: 2px solid ${props => props.active ? 'var(--red)' : 'transparent'};
    svg {
        path {
            stroke: ${props => props.active ? 'var(--red)' : 'var(--font)'}
        }
    }
    a {
        font-family: MullerMedium;
        font-size: 12px;
        line-height: 12px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--black);
        margin-left: 10px;
        text-decoration: none;
    }
`

type Props = {}

const Sidebar: FC<Props> = () => {
    const { t } = useTranslation();
    const { pathname } = useLocation();
    const { data } = useQuery(DETAILS, {});

    return <Suspense fallback={<Loader />}>
        <>
            <Name>{data ? `${data.details.firstname} ${data.details.lastname}` : ``}</Name>
            <Menu>
                <Item active={pathname.indexOf('ordenes') < 0}>
                    <ProfileIcon />
                    <Link to="/mi-cuenta">{t('account.sidebar.personal_info')}</Link>
                </Item>
                <Item active={pathname.indexOf('ordenes') >= 0}>
                    <History />
                    <Link to="/mi-cuenta/ordenes">{t('account.sidebar.history')}</Link>
                </Item>
            </Menu>
        </>
    </Suspense>
}

export default Sidebar;