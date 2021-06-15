import React, { FC, Suspense, useState, KeyboardEvent } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { toLink } from "../../utils/string";
import { BREAKPOINT } from "../../utils/constants";
import { SET_USER } from "../../graphql/user/mutations";
import { useMutation, useQuery } from "react-apollo";
import { GET_USER } from "../../graphql/user/queries";



const Cta = React.lazy(() => import(/* webpackChunkName: "Cta" */ "../Cta"));

const Container = styled.div`
  padding: 80px 20px 160px;

  min-height: 520px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #93531d no-repeat center center / cover;
  margin-top:-40px;
  margin-bottom: 88px;
  position: relative;

  > div > img {
    width: 140px;
  }


  @media screen and (max-width: ${BREAKPOINT}) {
    padding: 40px 20px;

  }

  > div {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const Title = styled.h2`
  font-family: MullerBlack;
  font-size: 48px;
  line-height: 48px;
  text-align: center;
  letter-spacing: 0.025em;
  text-transform: uppercase;
  color: var(--whiter);
  margin: 30px 0;
  padding: 0;
  @media screen and (max-width: ${BREAKPOINT}) {
    font-size: 35px;
    line-height: 122%;
  }
`;

const SearchBox = styled.div`
  display: flex;
  flex-direction: row;
  background: white;
  align-items: center;
  border-radius: 30px;
  @media screen and (max-width: ${BREAKPOINT}) {
    position: relative;
    flex-direction: column;
  }
`;

const CitySelect = styled.div`
  display: flex;
  align-items: center;
  background: var(--whiter);
  box-shadow: 8px 0px 26px rgba(0, 0, 0, 0.1);
  border-radius: 30px;
  padding: 15px 24px;
  margin-right: 30px;
  cursor: pointer;
  span {
    font-family: MullerMedium;
    margin: 0 16px;
    font-size: 14px;
    line-height: 14px;
    letter-spacing: 0.01em;
    color: var(--font);
    flex: 1;
  }
  @media screen and (max-width: ${BREAKPOINT}) {
    box-shadow: 0 0;
    background: white;
    margin-right: 0;
    border-radius: 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    margin: 20px 25px 0;
    padding-bottom: 25px;
    span {
      font-size: 12px;
      line-height: 12px;
      color: var(--black);
    }
  }
`;

const ProductBox = styled.div`
  padding-right: 30px;
  input {
    font-family: MullerMedium;
    min-width: 220px;
    background: none;
    border: 0;
    font-size: 14px;
    line-height: 14px;
    letter-spacing: 0.01em;
    color: var(--font);
  }
  @media screen and (max-width: ${BREAKPOINT}) {
    margin: 20px 20px 75px;
    padding-right: 0;
    input {
      font-size: 12px;
      line-height: 12px;
      color: var(--black);
      text-align: center;
    }
  }
`;

const CtaWrapper = styled.div`
  button {
    padding: 15px 50px;
    margin-top: 30px;
    text-transform: uppercase;
    span {
      font-family: MullerBold;
    }
  }
  @media screen and (max-width: ${BREAKPOINT}) {
    position: absolute;
    bottom: 0;
    width: 100%;
    button {
      width: 100%;
    }
  }
`;

const Image = styled.img`
  position:absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;

`

const Loader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  img {
    max-width: 100%;
  }
`

type Props = {};

const Hero: FC<Props> = () => {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const history = useHistory();
  const { data: userData } = useQuery(GET_USER, {});
  const [toggleCityModal] = useMutation(SET_USER, {
    variables: { user: { openCityModal: true } }
  });

  const search = ($evt: KeyboardEvent) => {
    if ($evt.keyCode === 13) {
      history.push(`/productos?q=${toLink(q)}`);
    }
  };

  const addressLabel = () => {
    if (userData.userInfo.length) {
      if (userData.userInfo[0].defaultAddressLabel)
        return `${userData.userInfo[0].defaultAddressLabel.replace(
          / \| /g,
          " "
        )}, Bolivia`;
      if (userData.userInfo[0].cityName)
        return `${userData.userInfo[0].cityName}, Bolivia`;
    }
    return t("homepage.hero.city_select");
  };

  return (
    <Suspense fallback={<Loader>
      <img src="/images/loader.svg" width="50px" height="50px" alt="loader" />
    </Loader>}>   
        <Container>
      {window.innerWidth < parseInt(BREAKPOINT.replace("px", "")) ?
      (//mobile
        <Image
        src="/images/375x500-ecommerce.webp"
        alt="hero"
      />
      ): (//desktop
          <Image
            src="/images/portada-e-commerce-final.webp"
            alt="hero"
          />
      )}
          <div>
            <img
              src={"https://d10nbigpolte6j.cloudfront.net/images/sofia-logo.webp"}
              className="lazyload"
              width="119px"
              height="83px"
              alt="Sofía Logo"
            />
            <Title>{t("homepage.hero.text")}</Title>
            <SearchBox>
              <CitySelect onClick={() => toggleCityModal()}>
                {/* pin */}
                <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.04917 0.991211C3.12177 0.991211 0 4.08646 0 7.98048C0 9.87757 0.704917 11.6748 2.11475 12.9728C2.21545 13.0727 6.24355 16.6671 6.34425 16.767C6.74706 17.0665 7.35127 17.0665 7.65338 16.767C7.75408 16.6671 11.8829 13.0727 11.8829 12.9728C13.2927 11.6748 13.9976 9.87757 13.9976 7.98048C14.0983 4.08646 10.9766 0.991211 7.04917 0.991211ZM7.04917 9.97741C5.94144 9.97741 5.03512 9.07879 5.03512 7.98048C5.03512 6.88217 5.94144 5.98355 7.04917 5.98355C8.15689 5.98355 9.06321 6.88217 9.06321 7.98048C9.06321 9.07879 8.15689 9.97741 7.04917 9.97741Z" fill="#E30613" />
                </svg>
                <span>{addressLabel()}</span>
                {/* chevron */}
                <svg width="11" height="6" viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1.38452L5.5 5.077L10 1.38452" stroke="#808080" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </CitySelect>
              <ProductBox>
                <input
                  onChange={evt => setQ(evt.target.value)}
                  onKeyUp={search}
                  type="text"
                  placeholder={t("homepage.hero.product_search")}
                />
              </ProductBox>
            </SearchBox>
            <CtaWrapper>
              <Cta
                filled={true}
                text={t("homepage.hero.search")}
                action={() => history.push(`/productos?q=${toLink(q)}`)}
              />
            </CtaWrapper>
          </div>
        </Container>
    </Suspense>
  );
};

export default Hero;
