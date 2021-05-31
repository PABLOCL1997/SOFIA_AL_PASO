import React, { FC, Suspense, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, Link } from "react-router-dom";
import styled from "styled-components";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { GET_CART_ITEMS, GET_TOTAL, GET_QTY } from "../../graphql/cart/queries";
import { Desktop, Mobile } from "../ResponsiveContainers";
import { BREAKPOINT, customStyles } from "../../utils/constants";
import { GET_USER } from "../../graphql/user/queries";
import { SET_USER } from "../../graphql/user/mutations";
import { token } from "../../utils/store";
import Search from "../Images/Search";
import {
  IngresarWrap,
  AddressHeader,
  RightMenu
} from "../../styled-components/HeaderStyles";

import UserIcon from "../../assets/images/profile-ingresar.svg";
import CartImg from "../../assets/images/Carrito.svg";
import BuscarIcon from "../../assets/images/buscar-zoom.svg";
import BuscarIconRed from "../../assets/images/buscar-zoom-red.svg";

const Loader = React.lazy(() =>
  import(/* webpackChunkName: "Loader" */ "../Loader")
);
const Cta = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../Cta"));

const Cart = React.lazy(() =>
  import(/* webpackChunkName: "Cart" */ "../Images/Cart")
);

const CityModal = React.lazy(() =>
  import(/* webpackChunkName: "CityModal" */ "./CityModal")
);
const AuthModal = React.lazy(() =>
  import(/* webpackChunkName: "AuthModal" */ "./AuthModal")
);
const CartModal = React.lazy(() =>
  import(/* webpackChunkName: "CartModal" */ "./CartModal")
);

const Wrapper = styled.div``;

const Fixed = styled.div<{ shadow: boolean }>`
  position: fixed;
  background: ${customStyles.yellow};
  width: 100%;
  left: 0;
  top: 0;
  z-index: 11;
  box-shadow: ${props => (props.shadow ? "0 0 15px #ccc" : "")};
`;

const Container = styled.div`
  /*  display: flex; */
  /*  flex-direction: row; */
  padding: 12px 40px;
  /*   align-items: center; */

  display: grid;
  grid-template-columns: 0.1fr 0.3fr 1fr 0.3fr 0fr 0.1fr;
  align-items: center;
  max-width: 1300px;
  margin: 0 auto;
`;

const Logo = styled.div`
  margin-right: 30px;
  cursor: pointer;
  @media screen and (max-width: ${BREAKPOINT}) {
    img {
      width: 60px !important;
    }
  }
`;

const Address = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  cursor: pointer;
  span {
    font-family: MullerMedium;
    font-weight: 500;
    font-size: 14px;
    line-height: 14px;
    margin: 0 8px;
  }
`;

const Total = styled.div`
  font-family: MullerMedium;
  font-weight: 500;
  font-size: 14px;
  line-height: 14px;
  margin: 0 32px;
`;

const CartWrapper = styled.div<any>`
  cursor: pointer;
  position: relative;
  transition: all 0.2s linear;
  transform: scale(1);
  animation: ${props => (props.big ? "pulse 1s infinite;" : "none")};
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
    opacity: 0.8;
  }
`;

const MenuWrapper = styled.div<any>`
  margin-left: 24px;
  cursor: pointer;
  transition: opacity 0.2s linear;
  &:hover {
    opacity: 0.8;
  }
`;

const SideMenu = styled.div<any>`
  position: fixed;
  top: 0;
  z-index: 4;
  right: 0;
  height: 100vh;
  background: white;
  padding: 40px;
  transform: translateX(100%);
  transition: transform 0.2s linear;
  &.open {
    transform: translateX(0);
  }
  @media screen and (max-width: ${BREAKPOINT}) {
    width: 100%;
  }
`;

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
`;

const CloseWrapper = styled.div`
  text-align: right;
  cursor: pointer;
  flex: 1;
  > svg {
    width: 14px;
    height: 14px;
  }
`;

const MenuList = styled.div`
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  padding-right: 80px;
`;

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
`;

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
`;

const MobileMenu = styled.div<{ page?: string }>`
  display: flex;
  flex-direction: column;
  padding: 20px 25px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.07);
  position: ${props => (props.page === "productpage" ? "fixed" : "")};
  top: 0;
  left: 0;
  width: 100%;
  background: ${customStyles.yellow};
  z-index: 3;
`;

const MobileMenuHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const Separator = styled.div`
  flex: 1;
`;

const MenuListTools = styled.div`
  display: flex;
  margin-bottom: 30px;
  > div:first-child {
    margin-right: 20px;
  }
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  flex: 1;
  background: #ffffff;
  border-radius: 44px;
  margin-right: 15px;

  height: 45px;
  svg {
    position: absolute;
    left: 20px;
    display: none;
  }
  input {
    background: none;
    border: 0;
    padding: 15px 25px;
    font-family: MullerBold;
    font-size: 14px;
    line-height: 14px;
    display: flex;
    align-items: center;
    letter-spacing: 0.01em;
    color: var(--black);
    flex: 1;
    &::placeholder {
      color: ${customStyles.darkGrey};
      font-size: 14px;
      line-height: 20px;
      font-family: MullerRegular;
    }
  }
  button {
    padding: 14px 40px;
    position: relative;
    height: 45px;

    &:before {
      content: "";
      background: url(${BuscarIcon}) no-repeat center center / contain;
      display: block;
      width: 20px;
      height: 20px;

      position: absolute;
      left: 15px;
    }

    &:hover {
      &:before {
        background: url(${BuscarIconRed}) no-repeat center center / contain;
      }
    }
    span {
      font-family: MullerBold;
      font-size: 14px;
      line-height: 20px;
      text-transform: uppercase;

      position: relative;
      left: 10px;
    }
  }

  @media (max-width: ${BREAKPOINT}) {
    margin-right: 0;
    margin-top: 15px;
    

    input {
      padding: 0 25px;
    }
    span {
      display: none;
    }

    button {
      padding: 14px 18px;
      height: 36px;
      &:before {
        width: 15px;
        left: 50%;
        transform: translate(-50%, 0);
      }
    }
  }
`;

type Props = {
  checkout: boolean;
  page?: string;
};

const Header: FC<Props> = ({ checkout, page }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [bigCart, setBigCart] = useState(false);
  const [open, setOpen] = useState(false);
  const [shadow, setShadow] = useState(false);
  const [newQuery, setNewQuery] = useState("")
  const { data } = useQuery(GET_CART_ITEMS);
  const { data: userData } = useQuery(GET_USER, {});
  const [toggleCityModal] = useMutation(SET_USER, {
    variables: { user: { openCityModal: true } }
  });
  const [toggleLoginModal] = useMutation(SET_USER, {
    variables: { user: { openLoginModal: true } }
  });
  const [toggleCartModal] = useMutation(SET_USER, {
    variables: { user: { openCartModal: true } }
  });
  const [logout] = useMutation(SET_USER, {
    variables: {
      user: {
        cityKey: "",
        cityName: "",
        defaultAddressId: null,
        defaultAddressLabel: "",
        openCityModal: false,
        openLoginModal: false,
        isLoggedIn: false,
        id: null
      }
    }
  });

  const doLogout = () => {
    logout();
    token.delete();
    setOpen(false);
    history.push("/");
  };

  const showCart = () => {
    setOpen(false);
    // if (userData.userInfo.length && userData.userInfo[0].isLoggedIn) {
    toggleCartModal();
    // } else {
    //   toggleLoginModal();
    // }
  };

  const goHome = () => {
    setOpen(false);
    history.push("/");
  };

  const myAccount = () => {
    setOpen(false);
    if (userData.userInfo.length && userData.userInfo[0].isLoggedIn) {
      history.push("/mi-cuenta");
    } else {
      toggleLoginModal();
    }
  };

  const addressLabel = () => {
    if (userData.userInfo.length && userData.userInfo.length) {
      if (userData.userInfo[0].idPriceList && userData.userInfo[0].idPriceList > 0) {
        return `${userData.userInfo[0].defaultAddressLabel.split("|")[0]}, Bolivia`
      }
      if (userData.userInfo[0].defaultAddressLabel)
        return `${userData.userInfo[0].defaultAddressLabel.replace(
          / \| /g,
          " "
        )}, Bolivia`;
      if (userData.userInfo[0].cityName)
        return `${userData.userInfo[0].cityName}, Bolivia`;
    }
    return "";
  };

  useEffect(() => {
    setBigCart(true);
    setTimeout(() => {
      setBigCart(false);
    }, 3000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (
      !userData.userInfo.length ||
      !userData.userInfo[0].cityKey ||
      userData.userInfo[0].openCityModal ||
      userData.userInfo[0].openCartModal
    ) {
      document.body.style.overflow = "hidden";
      document.body.style.maxHeight = "none";
    } else {
      document.body.removeAttribute("style");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.removeAttribute("style");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const checkScroll = (e: Event) => {
    setShadow(window.scrollY !== 0);
  };

  const handleSearch = () => {
    history.push(`/productos?q=${newQuery}`)
  }

  useEffect(() => {
    window.addEventListener("scroll", checkScroll);
    return () => {
      window.removeEventListener("scroll", checkScroll);
    };
  }, []);

  return (
    <Wrapper>
        <Suspense fallback={<div></div>}>
          <AuthModal />
          <CityModal />
          <CartModal />
        </Suspense>
        <Desktop>
          <Fixed shadow={shadow}>
            <div className="main-container">
              {!checkout && (
                <Container>
                  <Logo>
                    <Link to="/">
                      <img
                        src={"https://d10nbigpolte6j.cloudfront.net/images/sofia-logo.webp"}
                        width="83px"
                        height="50px"
                        alt={"Sofía"}
                      />
                    </Link>
                  </Logo>
                  <AddressHeader>
                    <Address onClick={() => toggleCityModal()}>
                      {/* pin */}
                      <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7.04917 0.991211C3.12177 0.991211 0 4.08646 0 7.98048C0 9.87757 0.704917 11.6748 2.11475 12.9728C2.21545 13.0727 6.24355 16.6671 6.34425 16.767C6.74706 17.0665 7.35127 17.0665 7.65338 16.767C7.75408 16.6671 11.8829 13.0727 11.8829 12.9728C13.2927 11.6748 13.9976 9.87757 13.9976 7.98048C14.0983 4.08646 10.9766 0.991211 7.04917 0.991211ZM7.04917 9.97741C5.94144 9.97741 5.03512 9.07879 5.03512 7.98048C5.03512 6.88217 5.94144 5.98355 7.04917 5.98355C8.15689 5.98355 9.06321 6.88217 9.06321 7.98048C9.06321 9.07879 8.15689 9.97741 7.04917 9.97741Z" fill="#E30613" />
                      </svg>
                      <span title={addressLabel()}>{addressLabel()}</span>
                    </Address>
                  </AddressHeader>
                  <InputGroup>
                    <Search />
                    {/* https://stackoverflow.com/questions/12374442/chrome-ignores-autocomplete-off */}
                    <input
                      id="product-search"
                      name="product-search"
                      type="search"
                      autoComplete="off"
                      onKeyUp={evt => {
                        if (evt.keyCode === 13) handleSearch()
                      }}
                      onChange={({ target: { value }}) => { setNewQuery(value)}}
                      placeholder={t("products.product_list.search_product")}
                    />
                    <Cta
                      filled={true}
                      action={() => handleSearch()}
                      text={t("products.product_list.search")}
                    />
                  </InputGroup>

                  {(!userData.userInfo.length ||
                    !userData.userInfo[0].isLoggedIn) && (
                    /*         <Cta text={t("header.login")} action={myAccount} /> */
                    <IngresarWrap onClick={myAccount}>
                      <img width="25" height="24" src={UserIcon} alt="login" />
                      <span>{t("header.login")}</span>
                    </IngresarWrap>
                  )}
                  {userData.userInfo.length && userData.userInfo[0].isLoggedIn && (
                    /*   <Cta text={t("header.account")} action={myAccount} /> */
                    <IngresarWrap onClick={myAccount}>
                      <img width="32" height="24" src={UserIcon} alt="my account" />
                      <span>{t("header.account")}</span>
                    </IngresarWrap>
                  )}

                  {/*    <Total>Bs. {GET_TOTAL(data.cartItems)}</Total> */}
                  <CartWrapper big={bigCart} onClick={showCart}>
                    <img width="32" height="24" src={CartImg} alt="Carrito de compras" />
                    <span>{GET_QTY(data.cartItems)}</span>
                  </CartWrapper>
                  <MenuWrapper onClick={() => setOpen(true)}>
                    {/* menu */}
                  <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 8.00024H22.6669" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="bevel" />
                      <path d="M1 1H22.6669" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="bevel" />
                      <path d="M11.834 15.0005H22.6674" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="bevel" />
                  </svg>
                  </MenuWrapper>
                </Container>
              )}
              {checkout && (
                <Container>
                  <Logo>
                    <Link to="/">
                      <img
                        src={"https://d10nbigpolte6j.cloudfront.net/images/sofia-logo.webp"}
                        width="83px"
                        height="50px"
                        alt={"Sofía"}
                      />
                    </Link>
                  </Logo>
                  <Separator />
                  <MenuWrapper onClick={() => setOpen(true)}>
                    {/* menu */}
                  <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 8.00024H22.6669" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="bevel" />
                      <path d="M1 1H22.6669" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="bevel" />
                      <path d="M11.834 15.0005H22.6674" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="bevel" />
                  </svg>
                  </MenuWrapper>
                </Container>
              )}
            </div>
          </Fixed>
        </Desktop>
        <Mobile>
          <MobileMenu page={page}>
            <MobileMenuHeader>
              <Logo>
                <Link to="/">
                  <img
                    src={"https://d10nbigpolte6j.cloudfront.net/images/sofia-logo.webp"}
                    width="60px"
                    height="36px"
                    alt={"Sofía"}
                  />
                </Link>
              </Logo>
              <RightMenu>
                <MenuListTools>
                  {(!userData.userInfo.length ||
                    !userData.userInfo[0].isLoggedIn) && (
                    <img width="25" height="24" src={UserIcon} alt="login" onClick={myAccount}/>
                  )}
                  {userData.userInfo.length && userData.userInfo[0].isLoggedIn && (
                    <img width="32" height="24" src={UserIcon} alt="my account" onClick={myAccount}/>
                  )}
                </MenuListTools>
                <CartWrapper onClick={showCart}>
                  <img width="32" height="24" src={CartImg} alt="Carrito de compras" />
                  <span>{GET_QTY(data.cartItems)}</span>
                </CartWrapper>
                <MenuWrapper onClick={() => setOpen(true)}>
                  {/* menu */}
                  <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 8.00024H22.6669" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="bevel" />
                      <path d="M1 1H22.6669" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="bevel" />
                      <path d="M11.834 15.0005H22.6674" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="bevel" />
                  </svg>
                </MenuWrapper>
              </RightMenu>
            </MobileMenuHeader>
            <Address onClick={() => toggleCityModal()}>
              {/* pin */}
                <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.04917 0.991211C3.12177 0.991211 0 4.08646 0 7.98048C0 9.87757 0.704917 11.6748 2.11475 12.9728C2.21545 13.0727 6.24355 16.6671 6.34425 16.767C6.74706 17.0665 7.35127 17.0665 7.65338 16.767C7.75408 16.6671 11.8829 13.0727 11.8829 12.9728C13.2927 11.6748 13.9976 9.87757 13.9976 7.98048C14.0983 4.08646 10.9766 0.991211 7.04917 0.991211ZM7.04917 9.97741C5.94144 9.97741 5.03512 9.07879 5.03512 7.98048C5.03512 6.88217 5.94144 5.98355 7.04917 5.98355C8.15689 5.98355 9.06321 6.88217 9.06321 7.98048C9.06321 9.07879 8.15689 9.97741 7.04917 9.97741Z" fill="#E30613" />
              </svg>
              <span>{addressLabel()}</span>
            </Address>
            <InputGroup>
              <Search />
              {/* https://stackoverflow.com/questions/12374442/chrome-ignores-autocomplete-off */}
              <input
                id="product-search"
                name="product-search"
                type="search"
                autoComplete="off"
                onKeyUp={evt => {
                  if (evt.keyCode === 13) handleSearch()
                }}
                onChange={({ target: { value }}) => { setNewQuery(value)}}
                placeholder={t("products.product_list.search_product")}
              />
              <Cta
                filled={true}
                action={() => handleSearch()}
                text={t("products.product_list.search")}
              />
            </InputGroup>
          </MobileMenu>
        </Mobile>
        <SideMenu className={open && "open"}>
          <CloseRow>
            <CartWrapper onClick={showCart}>
              <Cart />
              <span>{GET_QTY(data.cartItems)}</span>
            </CartWrapper>
            <Total>Bs. {GET_TOTAL(data.cartItems)}</Total>
            <CloseWrapper onClick={() => setOpen(false)}>
              {/* close */}
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2L2 16" stroke="#808080" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
                <path d="M16 16L2 2" stroke="#808080" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
              </svg>
            </CloseWrapper>
          </CloseRow>
          <MenuList>
            <MenuListTools>
              {(!userData.userInfo.length ||
                !userData.userInfo[0].isLoggedIn) && (
                <Cta text={t("header.login")} action={myAccount} />
              )}
              {userData.userInfo.length && userData.userInfo[0].isLoggedIn && (
                <Cta text={t("header.account")} action={myAccount} />
              )}
              {userData.userInfo.length && userData.userInfo[0].isLoggedIn && (
                <Cta text={t("header.logout")} action={doLogout} />
              )}
            </MenuListTools>
            <MenuItem>
            {/* home */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 10V23H9V16H15V23H22V10L12 2Z" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
              </svg>
              <Link onClick={() => setOpen(false)} to="/">
                {t("header.home")}
              </Link>
            </MenuItem>
            <MenuItem>
            {/* steak */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 8V13C1 16.1 4.1 21 12 21C20.2 21 23 20.4 23 17V12" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" />
                <path d="M6 3C3.1 3 1 5.2 1 8C1 11.1 4.1 16 12 16C20.2 16 23 15.4 23 12C23 9.7 20 8 17 8C12.1 8 12.7 3 6 3Z" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
                <path d="M10 9C10 9.8 8.1 10.6 6.9 10.4C5.8 10.1 5 9.1 5 8.2C5 7.3 5.5 6.5 6.6 6.5C7.7 6.5 10 7.9 10 9Z" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
              </svg>
              <Link onClick={() => setOpen(false)} to="/productos">
                {t("header.products")}
              </Link>
            </MenuItem>
            <MenuItem>
            {/* faq */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 5H1V21H21V13" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
                  <path d="M13 3V7C13 7.53043 13.2107 8.03914 13.5858 8.41421C13.9609 8.78929 14.4696 9 15 9V11L19 9H21C21.5304 9 22.0391 8.78929 22.4142 8.41421C22.7893 8.03914 23 7.53043 23 7V3C23 2.46957 22.7893 1.96086 22.4142 1.58579C22.0391 1.21071 21.5304 1 21 1H15C14.4696 1 13.9609 1.21071 13.5858 1.58579C13.2107 1.96086 13 2.46957 13 3V3Z" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
                  <path d="M8 13C9.10457 13 10 12.1046 10 11C10 9.89543 9.10457 9 8 9C6.89543 9 6 9.89543 6 11C6 12.1046 6.89543 13 8 13Z" fill="#E30613" />
                  <path d="M8 14C9.06087 14 10.0783 14.4214 10.8284 15.1716C11.5786 15.9217 12 16.9391 12 18H4C4 16.9391 4.42143 15.9217 5.17157 15.1716C5.92172 14.4214 6.93913 14 8 14Z" fill="#E30613" />
              </svg>
              <Link onClick={() => setOpen(false)} to="/preguntas-frecuentes">
                {t("header.faq")}
              </Link>
            </MenuItem>
          </MenuList>
          <MenuBottom>
              <img
                src={"https://d10nbigpolte6j.cloudfront.net/images/sofia-logo.webp"}
                width="60px"
                height="36px"
                alt={"Sofía"}
              />
            <span>{t("header.slogan")}</span>
          </MenuBottom>
        </SideMenu>

      </Wrapper>
  );
};

export default Header;
