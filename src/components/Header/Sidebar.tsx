import { useQuery } from "@apollo/react-hooks";
import React, { FC, useState } from "react";
import { GET_TOTAL, GET_QTY, GET_CART_ITEMS } from "../../graphql/cart/queries";
import { token } from "../../utils/store";
import { Total, CloseRow, CloseWrapper, MenuList, MenuItem, MenuBottom, MenuListTools, CartWrapper, Category, Subcategory, CartText } from "../../styled-components/HeaderStyles";
import { Link, useHistory } from "react-router-dom";
import Cta from "../Cta";
import { GET_USER } from "../../graphql/user/queries";
import { useTranslation } from "react-i18next";
import useCategory from "../../hooks/useCategory";
import { CategoryType, SubCategoryLvl3Type } from "../../graphql/categories/type";
import styled from "styled-components";
import { toLink, keepGoogleQueryParameter } from "../../utils/string";
import { useDeviceDetect } from "../../utils/deviceDetect";
import useUser from "../../hooks/useUser";
import CartImg from "../../assets/images/Carrito.svg";
import MisFacturas from "../../assets/images/mis-facturas.svg";

const Cart = React.lazy(() => import(/* webpackChunkName: "Cart" */ "../Images/Cart")); //TODO: DELETE?
const Chevron = React.lazy(() => import(/* webpackChunkName: "Chevron" */ "../Images/Chevron"));

const ChevronWrapper = styled.div<{ active: boolean }>`
  margin: 0 10px 0 10px;
  display: inline;

  ${({ active }) =>
    active
      ? `
    svg {
      transform: rotate(180deg);
    }
  `
      : ``}
`;

const Wrapper = styled.aside`
  display: flex;
  flex-direction: column;

  height: 100%;

  svg {
    cursor: pointer;
  }
`;

type Props = {
  setOpen: Function;
};

const Sidebar: FC<Props> = ({ setOpen }) => {
  const { data: userData } = useQuery(GET_USER, {});
  const { logout, toggleLoginModal, toggleCartModal } = useUser();
  const history = useHistory();
  const { t } = useTranslation();
  const { categories } = useCategory();
  const { data } = useQuery(GET_CART_ITEMS);
  const { isMobile } = useDeviceDetect();
  const [showCategories, setShowCategories] = useState<boolean>(true);
  const [categoryOpen, setCategoryOpen] = useState<number>(0);

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
    <Wrapper>
      <CloseRow>
        <CartWrapper onClick={showCart}>
          {/* <Cart /> */}
          <img width="27" height="19" src={CartImg} alt="Carrito de compras" />
          <CartText>{GET_QTY(data.cartItems)}</CartText>
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
          {(!userData.userInfo.length || !userData.userInfo[0].isLoggedIn) && <Cta text={t("header.login")} action={myAccount} />}
          {userData.userInfo.length && userData.userInfo[0].isLoggedIn && <Cta text={t("header.account")} action={myAccount} />}
          {userData.userInfo.length && userData.userInfo[0].isLoggedIn && <Cta text={t("header.logout")} action={doLogout} />}
        </MenuListTools>
        <MenuItem>
          {/* home */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 10V23H9V16H15V23H22V10L12 2Z" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
          </svg>
          <Link onClick={() => setOpen(false)} to={keepGoogleQueryParameter("/")}>
            {t("header.home")}
          </Link>
        </MenuItem>
        <MenuItem>
          {/* Mis Facturas */}
          <img src={MisFacturas} alt="mis-facturas" />
          <a href="https://misfacturas.sofia.com.bo/dio-public/" target="_blank" rel="noopener noreferrer">
            {t("header.bills")}
          </a>
        </MenuItem>
        <MenuItem>
          {/* faq */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 5H1V21H21V13" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
            <path
              d="M13 3V7C13 7.53043 13.2107 8.03914 13.5858 8.41421C13.9609 8.78929 14.4696 9 15 9V11L19 9H21C21.5304 9 22.0391 8.78929 22.4142 8.41421C22.7893 8.03914 23 7.53043 23 7V3C23 2.46957 22.7893 1.96086 22.4142 1.58579C22.0391 1.21071 21.5304 1 21 1H15C14.4696 1 13.9609 1.21071 13.5858 1.58579C13.2107 1.96086 13 2.46957 13 3V3Z"
              stroke="#E30613"
              strokeWidth="2"
              strokeMiterlimit="10"
              strokeLinecap="square"
            />
            <path d="M8 13C9.10457 13 10 12.1046 10 11C10 9.89543 9.10457 9 8 9C6.89543 9 6 9.89543 6 11C6 12.1046 6.89543 13 8 13Z" fill="#E30613" />
            <path d="M8 14C9.06087 14 10.0783 14.4214 10.8284 15.1716C11.5786 15.9217 12 16.9391 12 18H4C4 16.9391 4.42143 15.9217 5.17157 15.1716C5.92172 14.4214 6.93913 14 8 14Z" fill="#E30613" />
          </svg>
          <Link onClick={() => setOpen(false)} to={keepGoogleQueryParameter("/preguntas-frecuentes")}>
            {t("header.faq")}
          </Link>
        </MenuItem>
        <MenuItem>
          {/* tracking */}
          <svg width="31" height="26" viewBox="0 0 31 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.3334 2H2V17.889H20.3334V2Z" stroke="#E30613" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M20.3335 8.1113H25.2224L28.8891 11.778V17.8891H20.3335V8.1113Z" stroke="#E30613" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
            <path
              d="M7.50003 24C9.18757 24 10.5556 22.6319 10.5556 20.9444C10.5556 19.2568 9.18757 17.8888 7.50003 17.8888C5.81248 17.8888 4.44446 19.2568 4.44446 20.9444C4.44446 22.6319 5.81248 24 7.50003 24Z"
              stroke="#E30613"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M23.3891 24C25.0766 24 26.4446 22.6319 26.4446 20.9444C26.4446 19.2568 25.0766 17.8888 23.3891 17.8888C21.7015 17.8888 20.3335 19.2568 20.3335 20.9444C20.3335 22.6319 21.7015 24 23.3891 24Z"
              stroke="#E30613"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <Link onClick={() => setOpen(false)} to={keepGoogleQueryParameter("/segui-tu-pedido")}>
            {t("header.tracking")}
          </Link>
        </MenuItem>
        <MenuItem>
          {/* contact */}
          <svg width="32" height="32" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.5 4.375L10 11.25L2.5 4.375" stroke="#E30613" strokeLinecap="round" strokeLinejoin="round" />
            <path
              d="M2.5 4.375H17.5V15C17.5 15.1658 17.4342 15.3247 17.3169 15.4419C17.1997 15.5592 17.0408 15.625 16.875 15.625H3.125C2.95924 15.625 2.80027 15.5592 2.68306 15.4419C2.56585 15.3247 2.5 15.1658 2.5 15V4.375Z"
              stroke="#E30613"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M8.63651 10L2.69287 15.4484" stroke="#E30613" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M17.307 15.4484L11.3633 10" stroke="#E30613" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <Link onClick={() => setOpen(false)} to={keepGoogleQueryParameter("/contacto")}>
            {t("header.contact")}
          </Link>
        </MenuItem>
        <MenuItem>
          {/* coverage */}
          <svg width="16" height="19" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M2.73113 13.5326L2.72456 13.5261L2.71775 13.5198C1.24484 12.1637 0.5 10.2805 0.5 8.27141C0.5 4.17092 3.78409 0.908691 7.93031 0.908691C12.0792 0.908691 15.3532 4.17055 15.2475 8.25848L15.2473 8.25848V8.27141C15.2473 10.2805 14.5025 12.1637 13.0296 13.5198L12.8682 13.6683V13.6937C12.8545 13.707 12.8394 13.7215 12.8231 13.7371C12.7006 13.8541 12.5226 14.0182 12.3048 14.2158C11.87 14.6102 11.2879 15.1279 10.7005 15.6472C10.1655 16.1201 9.61853 16.6008 9.1779 16.9881C8.6647 17.4392 8.29575 17.7635 8.25802 17.8009C8.20544 17.853 8.091 17.9087 7.91615 17.9087C7.75344 17.9087 7.58518 17.8588 7.45418 17.768C7.24848 17.579 6.24628 16.6823 5.2316 15.7745L5.09159 15.6492L5.09032 15.648C4.51007 15.1289 3.93016 14.61 3.48814 14.2138C3.26694 14.0156 3.08053 13.8483 2.946 13.7271C2.87868 13.6665 2.82475 13.6178 2.78608 13.5827C2.7595 13.5585 2.74401 13.5443 2.73649 13.5374C2.73147 13.5328 2.72999 13.5314 2.73113 13.5326ZM5.16451 8.27141C5.16451 9.78714 6.41202 11.0179 7.93031 11.0179C9.4486 11.0179 10.6961 9.78714 10.6961 8.27141C10.6961 6.75567 9.4486 5.52492 7.93031 5.52492C6.41202 5.52492 5.16451 6.75567 5.16451 8.27141Z"
              stroke="#E30613"
            />
          </svg>
          <Link onClick={() => setOpen(false)} to={keepGoogleQueryParameter("/cobertura")}>
            {t("header.coverage")}
          </Link>
        </MenuItem>
        <MenuItem>
          {/* steak */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 8V13C1 16.1 4.1 21 12 21C20.2 21 23 20.4 23 17V12" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" />
            <path
              d="M6 3C3.1 3 1 5.2 1 8C1 11.1 4.1 16 12 16C20.2 16 23 15.4 23 12C23 9.7 20 8 17 8C12.1 8 12.7 3 6 3Z"
              stroke="#E30613"
              strokeWidth="2"
              strokeMiterlimit="10"
              strokeLinecap="square"
            />
            <path d="M10 9C10 9.8 8.1 10.6 6.9 10.4C5.8 10.1 5 9.1 5 8.2C5 7.3 5.5 6.5 6.6 6.5C7.7 6.5 10 7.9 10 9Z" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
          </svg>
          {/* <Link onClick={() => setOpen(false)} to="/productos"> */}
          <span onClick={() => setShowCategories(!showCategories)}>
            {t("header.products")}{" "}
            <ChevronWrapper active={showCategories}>
              <Chevron />
            </ChevronWrapper>
          </span>
          {/* </Link> */}
        </MenuItem>

        {categories &&
          React.Children.toArray(
            categories
              .filter((category: CategoryType) => !category.is_campaign)
              .map((category: CategoryType) => (
                <>
                  <Category isVisible={showCategories} showSubCategories={category.entity_id === categoryOpen}>
                    <span
                      onClick={() => {
                        category.entity_id === categoryOpen ? setCategoryOpen(0) : setCategoryOpen(category.entity_id);
                      }}
                    >
                      <Link
                        onClick={() => {
                          isMobile && setOpen(false);
                        }}
                        to={keepGoogleQueryParameter(`/productos/${toLink(category.name)}`)}
                      >
                        {category.name}
                      </Link>
                      {category.subcategories && category.subcategories.length > 0 && (
                        <ChevronWrapper active={category.entity_id === categoryOpen}>
                          <Chevron />
                        </ChevronWrapper>
                      )}
                    </span>

                    {category.subcategories &&
                      React.Children.toArray(
                        category.subcategories.map((subcategory: SubCategoryLvl3Type) => (
                          <Subcategory>
                            <Link
                              onClick={() => {
                                isMobile && setOpen(false);
                              }}
                              to={keepGoogleQueryParameter(`/productos/${toLink(category.name)}/${toLink(subcategory.name)}`)}
                            >
                              {subcategory.name}
                            </Link>
                          </Subcategory>
                        ))
                      )}
                  </Category>
                </>
              ))
          )}
      </MenuList>
      <MenuBottom>
        <img src={"https://d10nbigpolte6j.cloudfront.net/images/sofia-logo.webp"} width="60px" height="36px" alt={"Sofía"} />
        <span>{t("header.slogan")}</span>
      </MenuBottom>
    </Wrapper>
  );
};

export default Sidebar;
