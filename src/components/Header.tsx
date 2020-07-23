import React, { FC, Suspense, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, Link } from "react-router-dom";
import styled from "styled-components";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { GET_CART_ITEMS, GET_TOTAL, GET_QTY } from "../graphql/cart/queries";
import { Desktop, Mobile } from "./ResponsiveContainers";
import { BREAKPOINT } from "../utils/constants";
import { GET_USER } from "../graphql/user/queries";
import { SET_USER } from "../graphql/user/mutations";
import { token } from "../utils/store";

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
  background: white;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 3;
  box-shadow: ${props => (props.shadow ? "0 0 15px #ccc" : "")};
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  padding: 12px 40px;
  align-items: center;
`;

const Logo = styled.div`
  margin-right: 60px;
  cursor: pointer;
  @media screen and (max-width: ${BREAKPOINT}) {
    margin: 0 auto;
    img {
      width: 48px !important;
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
  background: var(--white);
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
    if (userData.userInfo.length && userData.userInfo[0].isLoggedIn) {
      toggleCartModal();
    } else {
      toggleLoginModal();
    }
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
                  <Address onClick={() => toggleCityModal()}>
                    <Pin />
                    <span>{addressLabel()}</span>
                  </Address>
                  {(!userData.userInfo.length ||
                    !userData.userInfo[0].isLoggedIn) && (
                    <Cta text={t("header.login")} action={myAccount} />
                  )}
                  {userData.userInfo.length &&
                    userData.userInfo[0].isLoggedIn && (
                      <Cta text={t("header.account")} action={myAccount} />
                    )}
                  <Total>Bs. {GET_TOTAL(data.cartItems)}</Total>
                  <CartWrapper big={bigCart} onClick={showCart}>
                    <Cart />
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
              <CartWrapper onClick={showCart}>
                <Cart />
                <span>{GET_QTY(data.cartItems)}</span>
              </CartWrapper>
              <Logo onClick={goHome}>
                <HeaderLogo />
              </Logo>
              <MenuWrapper onClick={() => setOpen(true)}>
                <Menu />
              </MenuWrapper>
            </MobileMenuHeader>
            <Address onClick={() => toggleCityModal()}>
              <Pin />
              <span>{addressLabel()}</span>
            </Address>
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
