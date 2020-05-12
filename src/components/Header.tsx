import React, { FC, Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, Link } from "react-router-dom";
import styled from 'styled-components';
import { useQuery, useMutation } from "@apollo/react-hooks";
import { GET_CART_ITEMS, GET_TOTAL, GET_QTY } from '../graphql/cart/queries';
import { Desktop, Mobile } from './ResponsiveContainers';
import { BREAKPOINT } from '../utils/constants';
import { GET_USER } from '../graphql/user/queries';
import { SET_USER } from '../graphql/user/mutations';

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */'./Loader'));
const Cta = React.lazy(() => import(/* webpackChunkName: "Loader" */'./Cta'));
const HeaderLogo = React.lazy(() => import(/* webpackChunkName: "HeaderLogo" */'./Images/HeaderLogo'));
const Pin = React.lazy(() => import(/* webpackChunkName: "Pin" */'./Images/Pin'));
const Cart = React.lazy(() => import(/* webpackChunkName: "Cart" */'./Images/Cart'));
const Menu = React.lazy(() => import(/* webpackChunkName: "Menu" */'./Images/Menu'));
const Close = React.lazy(() => import(/* webpackChunkName: "Close" */'./Images/Close'));
const Home = React.lazy(() => import(/* webpackChunkName: "Home" */'./Images/Home'));
const Steak = React.lazy(() => import(/* webpackChunkName: "Steak" */'./Images/Steak'));
const Faq = React.lazy(() => import(/* webpackChunkName: "Faq" */'./Images/Faq'));
const CityModal = React.lazy(() => import(/* webpackChunkName: "CityModal" */'./CityModal'));
const AuthModal = React.lazy(() => import(/* webpackChunkName: "AuthModal" */'./AuthModal'));
const CartModal = React.lazy(() => import(/* webpackChunkName: "CartModal" */'./CartModal'));

const Wrapper = styled.div``

const Fixed = styled.div`
    position: fixed;
    background: white;
    width: 100%;
    left: 0;
    top: 0;
    z-index: 3;
`

const Container = styled.div`
    display: flex;
    flex-direction: row;
    padding: var(--padding);
    align-items: center;
`

const Logo = styled.div`
    margin-right: 60px;
    cursor: pointer;
    @media screen and (max-width: ${BREAKPOINT}) {
        margin: 0 auto;
    }
`

const Address = styled.div`
    display: flex;
    align-items: center;
    flex: 1;
    span {
        font-family: MullerMedium;
        font-weight: 500;
        font-size: 14px;
        line-height: 14px;
        margin: 0 8px;
    }
`

const Total = styled.div`
    font-family: MullerMedium;
    font-weight: 500;
    font-size: 14px;
    line-height: 14px;
    margin: 0 32px;
`

const CartWrapper = styled.div<any>`
    cursor: pointer;
    position: relative;
    span {
        font-family: MullerBold;
        font-size: 8px;
        color: white;
        position: absolute;
        top: 5px;
        right: 2px;
        display: block;
        width: 14px;
        height: 14px;
        text-align: center;
        line-height: 14px;
    }
    &:hover {
        opacity: .8;
    }
`

const MenuWrapper = styled.div<any>`
    margin-left: 24px;
    cursor: pointer;
    transition: opacity .2s linear;
    &:hover {
        opacity: .8;
    }
`

const SideMenu = styled.div<any>`
    position: fixed;
    top: 0;
    z-index: 3;
    right: 0;
    height: 100vh;
    background: white;
    padding: 40px;
    transform: translateX(100%);
    transition: transform .2s linear;
    &.open {
        transform: translateX(0);
    }
    @media screen and (max-width: ${BREAKPOINT}) {
        width: 100%;
    }
`

const CloseRow = styled.div`
    display: flex;
    align-items: center;
    > div {
        display: none;
        &:last-child {
            display: block;
        }
        @media screen and (max-width: ${BREAKPOINT}) {
            display: block;
        }
    }
`

const CloseWrapper = styled.div`
    text-align: right;
    cursor: pointer;
    flex: 1;
    > svg {
        width: 14px;
        height: 14px;
    }
`

const MenuList = styled.div`
    margin-top: 100px;
    display: flex;
    flex-direction: column;
    padding-right: 80px;
`

const MenuItem = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    > svg {
        width: 20px;
        height: 20px;
    }
    a {
        text-decoration: none;
        font-family: MullerMedium;
        font-size: 16px;
        line-height: 16px;
        color: var(--black);
        margin-left: 10px;
    }
`

const MenuBottom = styled.div`
    position: absolute;
    bottom: 50px;
    display: flex;
    align-items: center;
    span {
        margin-left: 20px;
        font-family: MullerBold;
        font-size: 14px;
        line-height: 20px;
        letter-spacing: 0.015em;
        color: var(--black);
    }
`

const MobileMenu = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 25px;
`

type Props = {}

const Header: FC<Props> = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const [open, setOpen] = useState(false);
    const { data } = useQuery(GET_CART_ITEMS);
    const { data: userData } = useQuery(GET_USER, {});
    const [toggleLoginModal] = useMutation(SET_USER, { variables: { user: { openLoginModal: true } } });
    const [toggleCartModal] = useMutation(SET_USER, { variables: { user: { openCartModal: true } } });
    const [logout] = useMutation(SET_USER, {
        variables: {
            user: {
                openLoginModal: false,
                isLoggedIn: false,
                id: null
            }
        }
    });

    return <Suspense fallback={<Loader />}>
        <Wrapper>
            <Desktop>
                <Fixed>
                    <div className="main-container">
                        <Container>
                            <Logo onClick={() => history.push('/')}>
                                <HeaderLogo />
                            </Logo>
                            <Address>
                                <Pin />
                                <span>{userData.userInfo.length && userData.userInfo[0].cityName ? `${userData.userInfo[0].cityName}, Bolivia` : ''}</span>
                            </Address>
                            {(!userData.userInfo.length || !userData.userInfo[0].id) && <Cta text={t('header.login')} action={() => toggleLoginModal()} />}
                            {userData.userInfo.length && userData.userInfo[0].isLoggedIn && <Cta text={t('header.logout')} action={() => logout()} />}
                            <Total>Bs. {GET_TOTAL(data.cartItems)}</Total>
                            <CartWrapper onClick={() => toggleCartModal()}>
                                <Cart />
                                <span>{GET_QTY(data.cartItems)}</span>
                            </CartWrapper>
                            <MenuWrapper onClick={() => setOpen(true)}>
                                <Menu />
                            </MenuWrapper>
                        </Container>
                    </div>
                </Fixed>
            </Desktop>
            <Mobile>
                <MobileMenu>
                    <CartWrapper onClick={() => toggleCartModal()}>
                        <Cart />
                        <span>{GET_QTY(data.cartItems)}</span>
                    </CartWrapper>
                    <Logo>
                        <HeaderLogo />
                    </Logo>
                    <MenuWrapper onClick={() => setOpen(true)}>
                        <Menu />
                    </MenuWrapper>
                </MobileMenu>
            </Mobile>
            <SideMenu className={open && 'open'}>
                <CloseRow>
                    <CartWrapper onClick={() => toggleCartModal()}>
                        <Cart />
                        <span>{GET_QTY(data.cartItems)}</span>
                    </CartWrapper>
                    <Total>Bs. {GET_TOTAL(data.cartItems)}</Total>
                    <CloseWrapper onClick={() => setOpen(false)}>
                        <Close />
                    </CloseWrapper>
                </CloseRow>
                <MenuList>
                    <MenuItem>
                        <Home />
                        <Link to="/">{t('header.home')}</Link>
                    </MenuItem>
                    <MenuItem>
                        <Steak />
                        <Link to="/productos">{t('header.products')}</Link>
                    </MenuItem>
                    <MenuItem>
                        <Faq />
                        <Link to="/faq">{t('header.faq')}</Link>
                    </MenuItem>
                </MenuList>
                <MenuBottom>
                    <HeaderLogo />
                    <span>{t('header.slogan')}</span>
                </MenuBottom>
            </SideMenu>
            <CityModal />
            <AuthModal />
            <CartModal />
        </Wrapper>
    </Suspense>
}

export default Header;