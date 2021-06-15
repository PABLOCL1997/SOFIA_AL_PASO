import { useMutation, useQuery } from "@apollo/react-hooks";
import React, { FC } from "react"
import { SET_USER } from "../../graphql/user/mutations";
import { GET_TOTAL, GET_QTY, GET_CART_ITEMS } from "../../graphql/cart/queries";

import { token } from "../../utils/store";

import {
    Total,
    CloseRow,
    CloseWrapper,
    MenuList,
    MenuItem,
    MenuBottom,
    MenuListTools,
    CartWrapper,

} from "../../styled-components/HeaderStyles";
import { Link, useHistory } from "react-router-dom";
import Cta from "../Cta";
import { GET_USER } from "../../graphql/user/queries";
import { useTranslation } from "react-i18next";

const Cart = React.lazy(() =>
  import(/* webpackChunkName: "Cart" */ "../Images/Cart")
);

type Props = {
    setOpen: Function;
}
const Sidebar: FC<Props> = ({ setOpen }) => {
    const history = useHistory();
    const { t } = useTranslation();

    const { data: userData } = useQuery(GET_USER, {});
    const { data } = useQuery(GET_CART_ITEMS);

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

    const [toggleLoginModal] = useMutation(SET_USER, {
        variables: { user: { openLoginModal: true } }
    });
    const [toggleCartModal] = useMutation(SET_USER, {
        variables: { user: { openCartModal: true } }
      });
    
    const myAccount = () => {
        setOpen(false);
        if (userData.userInfo.length && userData.userInfo[0].isLoggedIn) {
            history.push("/mi-cuenta");
        } else {
            toggleLoginModal();
        }
    };

    const showCart = () => {
        setOpen(false);
        toggleCartModal();
      };
    
    const doLogout = () => {
        logout();
        token.delete();
        setOpen(false);
        history.push("/");
      };
    return (
        <>
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
      </>)
}

export default Sidebar