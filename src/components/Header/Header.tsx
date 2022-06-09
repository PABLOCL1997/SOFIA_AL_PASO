import React, { FC, Suspense, useState, useEffect, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { GET_CART_ITEMS, GET_QTY } from "../../graphql/cart/queries";
import { GET_USER } from "../../graphql/user/queries";
import { SET_USER } from "../../graphql/user/mutations";
import { Location } from "../../context/Location";
import Search from "../Images/Search";
import * as SC from "../../styled-components/HeaderStyles";

import Wallet from "../../assets/images/empresa-seleccionado.svg";

import UserIcon from "../../assets/images/profile-ingresar.svg";
import UserCheckout from "../../assets/images/profile-checkout.svg";
import CartImg from "../../assets/images/Carrito.svg";
import MenuIcon from "../../assets/images/menuButton.svg";
import SofiaAlPasoLogo from "../../assets/images/sofiaAlPasoLogo.webp";
import SofiaAlPasoColaboradoresLogo from "../../assets/images/sofiaAlPasoColaboradoresLogo.svg";

import { trackGoToCartEvent } from "../../utils/dataLayer";
import { keepGoogleQueryParameter } from "../../utils/string";
import useCityPriceList from "../../hooks/useCityPriceList";
import { getStep, Steps } from "../../types/Checkout";
import ShippingType from "./ShippingType";
import useUser from "../../hooks/useUser";
import ChooseUserType from "./ChooseUserType";
import useModals from "../../hooks/useModals";

const Cta = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../Cta"));

const CityModal = React.lazy(() => import(/* webpackChunkName: "CityModal" */ "./CityModal"));
const AuthModal = React.lazy(() => import(/* webpackChunkName: "AuthModal" */ "./AuthModal/"));
const CartModal = React.lazy(() => import(/* webpackChunkName: "CartModal" */ "./CartModal"));
const Sidebar = React.lazy(() => import(/* webpackChunkName: "Sidebar" */ "./Sidebar"));

type Props = {
  checkout: boolean;
  page?: string;
  route?: string;
};

const Header: FC<Props> = ({ checkout, page, route }) => {
  const { t } = useTranslation();
  const { showPromoBar, hideBar, isB2E } = useUser();
  const history = useHistory();
  const [addressCity, setAddressCity] = useState("Santa Cruz, Bolivia");
  const [open, setOpen] = useState(false);
  const [shadow, setShadow] = useState(false);
  const [newQuery, setNewQuery] = useState("");
  const {
    modals: { showChooseUserType },
  } = useModals();

  const currentStep = useContext(Location.Context);
  const step: Steps = useMemo(() => getStep(currentStep), [currentStep]);
  // check with use memo if we are at /checkout
  const isCheckout = useMemo(() => {
    return history.location.pathname === "/checkout";
  }, [history, history?.location?.pathname]);

  const { data } = useQuery(GET_CART_ITEMS);
  const { idPriceList } = useCityPriceList();
  const { data: userData } = useQuery(GET_USER, {});
  const [toggleCityModal] = useMutation(SET_USER, {
    variables: { user: { openCityModal: true } },
  });
  const [toggleLoginModal] = useMutation(SET_USER, {
    variables: { user: { openLoginModal: true } },
  });
  const [toggleCartModal] = useMutation(SET_USER, {
    variables: { user: { openCartModal: true } },
  });

  const showCart = () => {
    trackGoToCartEvent();
    setOpen(false);
    toggleCartModal();
  };

  const myAccount = () => {
    setOpen(false);
    if (userData.userInfo.length && userData.userInfo[0].isLoggedIn) {
      history.push(keepGoogleQueryParameter("/mi-cuenta"));
    } else {
      toggleLoginModal();
    }
  };

  const goToCollaborators = () => {
    setOpen(false);
    history.push(keepGoogleQueryParameter("/activacion"));
  };

  const addressLabel = () => {
    if (userData?.userInfo.length && userData?.userInfo[0].defaultAddressLabel) {
      if (idPriceList > 0) return `${userData.userInfo[0].defaultAddressLabel.split("|")[0]}`;

      if (userData.userInfo[0].defaultAddressLabel) return `${userData.userInfo[0].defaultAddressLabel.replace(/ \| /g, " ")}`;
    }
    if (userData?.userInfo.length && userData?.userInfo[0].cityName) {
      if (userData.userInfo[0].cityName) return `${userData.userInfo[0].cityName}, Bolivia`;
    }
    return "";
  };

  useEffect(() => {
    if (route !== "/") {
      hideBar();
    }
  }, [route]);

  useEffect(() => {
    if (!userData?.userInfo.length || !userData?.userInfo[0].cityKey || userData?.userInfo[0].openCityModal || userData?.userInfo[0].openCartModal) {
      document.body.style.overflow = "hidden";
      document.body.style.maxHeight = "none";
    } else {
      document.body.removeAttribute("style");
    }
    const address = addressLabel();
    if (addressCity !== address) {
      setAddressCity(address);
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
    history.push(keepGoogleQueryParameter(`/productos?q=${newQuery}`));
  };

  useEffect(() => {
    window.addEventListener("scroll", checkScroll);
    return () => {
      window.removeEventListener("scroll", checkScroll);
    };
  }, []);

  return (
    <>
      <SC.Fixed shadow={shadow} showPromoBar={showPromoBar}>
        <Suspense fallback={<></>}>
          <AuthModal />
          <CityModal />
          <CartModal />
          {showChooseUserType ? <ChooseUserType /> : null}
        </Suspense>
        <SC.Container isCheckout={isCheckout}>
          <SC.HeaderClip isB2E={isB2E}>
            <SC.HeaderClipTextWrapper>
              <SC.HeaderClipText />
              {isB2E && <SC.HeaderClipText>Colaboradores</SC.HeaderClipText>}
            </SC.HeaderClipTextWrapper>
          </SC.HeaderClip>
          {isCheckout && window.innerWidth < 500 && (
            <SC.IngresarWrap onClick={myAccount}>
              <SC.IngresarImg width="32" height="26" src={UserCheckout} alt="login" />
              {!userData.userInfo.length || !userData.userInfo[0].isLoggedIn ? <SC.IngresarText>{t("header.login")}</SC.IngresarText> : <SC.IngresarText>{t("header.account")}</SC.IngresarText>}
            </SC.IngresarWrap>
          )}
          <SC.Logo isB2E={isB2E} isCheckout={isCheckout}>
            <Link to={keepGoogleQueryParameter("/")}>
              <img src={!isB2E ? SofiaAlPasoLogo : SofiaAlPasoColaboradoresLogo} height="30px" alt={"Sofía"} />
            </Link>
          </SC.Logo>
          {isCheckout ? (
            <SC.Steps.Container>
              {step === Steps.Billing || step === Steps.Cart ? <SC.Steps.First /> : null}

              {step === Steps.Shipping || step === Steps.Timeframe ? <SC.Steps.Second /> : null}

              {step === Steps.Payment ? <SC.Steps.Third /> : null}

              {step === Steps.Review ? <SC.Steps.Fourth /> : null}
            </SC.Steps.Container>
          ) : (
            <>
              <ShippingType onClick={toggleCityModal} />
              <SC.InputGroup>
                <Search />
                {/* https://stackoverflow.com/questions/12374442/chrome-ignores-autocomplete-off */}
                <SC.InputGroupSearchInput
                  id="product-search"
                  name="product-search"
                  type="search"
                  autoComplete="off"
                  onKeyUp={(evt) => {
                    if (evt.keyCode === 13) handleSearch();
                  }}
                  onChange={({ target: { value } }) => {
                    setNewQuery(value);
                  }}
                  placeholder={t("products.product_list.search_product")}
                />
                <Cta filled action={() => handleSearch()} text={t("products.product_list.search")} />
              </SC.InputGroup>
              <SC.IngresarWrap onClick={myAccount}>
                <SC.IngresarImg width="35" height="29" src={UserIcon} alt="login" />
                {!userData.userInfo.length || !userData.userInfo[0].isLoggedIn ? <SC.IngresarText>{t("header.login")}</SC.IngresarText> : <SC.IngresarText>{t("header.account")}</SC.IngresarText>}
              </SC.IngresarWrap>
              <SC.IngresarWrap onClick={goToCollaborators}>
                <SC.IngresarImg width="25" height="24" src={Wallet} alt="wallet" />
                <SC.IngresarText>{t("header.collaborators")}</SC.IngresarText>
              </SC.IngresarWrap>

              <SC.CartWrapper onClick={showCart}>
                <SC.IngresarImg width="32" height="24" src={CartImg} alt="Carrito de compras" />
                {data && data.cartItems && data.cartItems.length ? <SC.CartText>{GET_QTY(data.cartItems)}</SC.CartText> : <SC.CartText>0</SC.CartText>}
              </SC.CartWrapper>
            </>
          )}
          <SC.MenuWrapper onClick={() => setOpen(true)} isCheckout={isCheckout}>
            {/* menu */}
            <img width="24" height="16" src={MenuIcon} alt="Menu" />
          </SC.MenuWrapper>
        </SC.Container>
        <Suspense fallback={<></>}>
          <SC.SideMenu className={open && "open"}>
            <Sidebar setOpen={setOpen} />
          </SC.SideMenu>
        </Suspense>
      </SC.Fixed>
    </>
  );
};

export default Header;
