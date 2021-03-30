import React, { FC, Suspense, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, Link } from "react-router-dom";
import styled from "styled-components";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { GET_CART_ITEMS, GET_TOTAL, GET_QTY } from "../graphql/cart/queries";
import { Desktop, Mobile } from "./ResponsiveContainers";
import { BREAKPOINT, customStyles } from "../utils/constants";
import { GET_USER } from "../graphql/user/queries";
import { SET_USER } from "../graphql/user/mutations";
import { token } from "../utils/store";
import Search from "./Images/Search";
import {
  IngresarWrap,
  AddressHeader,
  RightMenu
} from "../styled-components/HeaderStyles";

import UserIcon from "../assets/images/profile-ingresar.svg";
import CartImg from "../assets/images/Carrito.svg";
import BuscarIcon from "../assets/images/buscar-zoom.svg";
import BuscarIconRed from "../assets/images/buscar-zoom-red.svg";

const Loader = React.lazy(() =>
  import(/* webpackChunkName: "Loader" */ "./Loader")
);
const Cta = React.lazy(() => import(/* webpackChunkName: "Loader" */ "./Cta"));
const HeaderLogo = React.lazy(() =>
  import(/* webpackChunkName: "HeaderLogo" */ "./Images/HeaderLogo")
);
const Pin = React.lazy(() =>
  import(/* webpackChunkName: "Pin" */ "./Images/Pin")
);
const Cart = React.lazy(() =>
  import(/* webpackChunkName: "Cart" */ "./Images/Cart")
);
const Menu = React.lazy(() =>
  import(/* webpackChunkName: "Menu" */ "./Images/Menu")
);
const Close = React.lazy(() =>
  import(/* webpackChunkName: "Close" */ "./Images/Close")
);
const Home = React.lazy(() =>
  import(/* webpackChunkName: "Home" */ "./Images/Home")
);
const Steak = React.lazy(() =>
  import(/* webpackChunkName: "Steak" */ "./Images/Steak")
);
const Faq = React.lazy(() =>
  import(/* webpackChunkName: "Faq" */ "./Images/Faq")
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
  z-index: 3;
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
  z-index: 99;
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
    <Suspense fallback={<Loader />}>
      <Wrapper>
        <Desktop>
          <Fixed shadow={shadow}>
            <div className="main-container">
              {!checkout && (
                <Container>
                  <Logo onClick={goHome}>
                    <HeaderLogo />
                  </Logo>
                  <AddressHeader>
                    <Address onClick={() => toggleCityModal()}>
                      <Pin />
                      <span title={addressLabel()}>{addressLabel()}</span>
                    </Address>
                  </AddressHeader>
                  <InputGroup>
                    <Search />
                    <input
                      type="search"
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
                      <img src={UserIcon} alt="login" />
                      <span>{t("header.login")}</span>
                    </IngresarWrap>
                  )}
                  {userData.userInfo.length && userData.userInfo[0].isLoggedIn && (
                    /*   <Cta text={t("header.account")} action={myAccount} /> */
                    <IngresarWrap onClick={myAccount}>
                      <img src={UserIcon} alt="my account" />
                      <span>{t("header.account")}</span>
                    </IngresarWrap>
                  )}

                  {/*    <Total>Bs. {GET_TOTAL(data.cartItems)}</Total> */}
                  <CartWrapper big={bigCart} onClick={showCart}>
                    <img src={CartImg} alt="" />
                    <span>{GET_QTY(data.cartItems)}</span>
                  </CartWrapper>
                  <MenuWrapper onClick={() => setOpen(true)}>
                    <Menu />
                  </MenuWrapper>
                </Container>
              )}
              {checkout && (
                <Container>
                  <Logo onClick={goHome}>
                    <HeaderLogo />
                  </Logo>
                  <Separator />
                  <MenuWrapper onClick={() => setOpen(true)}>
                    <Menu />
                  </MenuWrapper>
                </Container>
              )}
            </div>
          </Fixed>
        </Desktop>
        <Mobile>
          <MobileMenu page={page}>
            <MobileMenuHeader>
              <Logo onClick={goHome}>
                <HeaderLogo />
              </Logo>
              <RightMenu>
                <MenuListTools>
                  {(!userData.userInfo.length ||
                    !userData.userInfo[0].isLoggedIn) && (
                    <img src={UserIcon} alt="login" onClick={myAccount}/>
                  )}
                  {userData.userInfo.length && userData.userInfo[0].isLoggedIn && (
                    <img src={UserIcon} alt="my account" onClick={myAccount}/>
                  )}
                </MenuListTools>
                <CartWrapper onClick={showCart}>
                  <img src={CartImg} alt="" />
                  <span>{GET_QTY(data.cartItems)}</span>
                </CartWrapper>
                <MenuWrapper onClick={() => setOpen(true)}>
                  <Menu />
                </MenuWrapper>
              </RightMenu>
            </MobileMenuHeader>
            <Address onClick={() => toggleCityModal()}>
              <Pin />
              <span>{addressLabel()}</span>
            </Address>
            <InputGroup>
              <Search />
              <input
                type="search"
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
              <Close />
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
              <Home />
              <Link onClick={() => setOpen(false)} to="/">
                {t("header.home")}
              </Link>
            </MenuItem>
            <MenuItem>
              <Steak />
              <Link onClick={() => setOpen(false)} to="/productos">
                {t("header.products")}
              </Link>
            </MenuItem>
            <MenuItem>
              <Faq />
              <Link onClick={() => setOpen(false)} to="/preguntas-frecuentes">
                {t("header.faq")}
              </Link>
            </MenuItem>
          </MenuList>
          <MenuBottom>
            <HeaderLogo />
            <span>{t("header.slogan")}</span>
          </MenuBottom>
        </SideMenu>
        <CityModal />
        <AuthModal />
        <CartModal />
      </Wrapper>
    </Suspense>
  );
};

export default Header;
