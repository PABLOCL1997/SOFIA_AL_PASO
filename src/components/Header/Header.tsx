import React, { FC, Suspense, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { GET_CART_ITEMS, GET_QTY } from "../../graphql/cart/queries";
import { GET_USER } from "../../graphql/user/queries";
import { SET_USER } from "../../graphql/user/mutations";
import Search from "../Images/Search";
import {
  IngresarWrap,
  AddressHeader,
  Fixed,
  Container,
  Logo,
  Address,
  CartWrapper,
  MenuWrapper,
  SideMenu,
  InputGroup
} from "../../styled-components/HeaderStyles";

import UserIcon from "../../assets/images/profile-ingresar.svg";
import CartImg from "../../assets/images/Carrito.svg";


const Cta = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../Cta"));

const CityModal = React.lazy(() =>
  import(/* webpackChunkName: "CityModal" */ "./CityModal")
);
const AuthModal = React.lazy(() =>
  import(/* webpackChunkName: "AuthModal" */ "./AuthModal")
);
const CartModal = React.lazy(() =>
  import(/* webpackChunkName: "CartModal" */ "./CartModal")
);

const Sidebar = React.lazy(() =>
  import(/* webpackChunkName: "Sidebar" */ "./Sidebar")
);


type Props = {
  checkout: boolean;
  page?: string;
};

const Header: FC<Props> = ({ checkout, page }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [bigCart, setBigCart] = useState(false);
  const [addressCity, setAddressCity] = useState('Santa Cruz, Bolivia');
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

  const showCart = () => {
    setOpen(false);
    // if (userData.userInfo.length && userData.userInfo[0].isLoggedIn) {
    toggleCartModal();
    // } else {
    //   toggleLoginModal();
    // }
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
    const address =  addressLabel()
    if (addressCity !== address) {
      setAddressCity(address)
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
        <Fixed shadow={shadow}>
          <Suspense fallback={<></>}>
            <AuthModal />
            <CityModal />
            <CartModal />
          </Suspense>
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
                <span title={addressCity}>{addressCity}</span>
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
            <IngresarWrap onClick={myAccount}>
              <img width="25" height="24" src={UserIcon} alt="login" />
              {(!userData.userInfo.length ||
                !userData.userInfo[0].isLoggedIn) ? 
                  <span>{t("header.login")}</span> :
                  <span>{t("header.account")}</span>
              }
            </IngresarWrap>
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
          <Suspense fallback={<></>}>
            <SideMenu className={open && "open"}>
              <Sidebar setOpen={setOpen} />
            </SideMenu>
          </Suspense>
        </Fixed>
      

  );
};

export default Header;
