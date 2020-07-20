import React, { FC, Suspense, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { toLink } from "../../utils/string";
import { BREAKPOINT } from "../../utils/constants";
import { SET_USER } from "../../graphql/user/mutations";
import { useMutation } from "react-apollo";

const Loader = React.lazy(() =>
  import(/* webpackChunkName: "Loader" */ "../Loader")
);
const HeaderLogoWhite = React.lazy(() =>
  import(/* webpackChunkName: "HeaderLogoWhite" */ "../Images/HeaderLogoWhite")
);
const Pin = React.lazy(() =>
  import(/* webpackChunkName: "Pin" */ "../Images/Pin")
);
const Chevron = React.lazy(() =>
  import(/* webpackChunkName: "Chevron" */ "../Images/Chevron")
);
const Cta = React.lazy(() => import(/* webpackChunkName: "Cta" */ "../Cta"));

const Container = styled.div`
  padding: 80px 20px 160px;
  min-height: 520px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: url(/images/hero_img.jpg) no-repeat center center / cover;
  margin-top: 15px;
  position: relative;

  > div > img {
    width: 140px;
  }
  @media screen and (max-width: ${BREAKPOINT}) {
    padding: 40px 20px;
    min-height: auto;
    > div > img {
      width: 90px;
    }
  }

  > div {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const Title = styled.h1`
  font-family: MullerBlack;
  font-size: 48px;
  line-height: 48px;
  text-align: center;
  letter-spacing: 0.025em;
  text-transform: uppercase;
  color: var(--black);
  margin: 30px 0;
  padding: 0;
  @media screen and (max-width: ${BREAKPOINT}) {
    font-size: 35px;
    line-height: 122%;
    text-shadow: 0px 15px 48px rgba(221, 181, 12, 0.85);
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

type Props = {};

const Hero: FC<Props> = () => {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const history = useHistory();
  const [toggleCityModal] = useMutation(SET_USER, {
    variables: { user: { openCityModal: true } }
  });

  return (
    <Suspense fallback={<Loader />}>
      <div>
        <Container>
          <div>
            <HeaderLogoWhite withSlogan={false} />
            <Title>{t("homepage.hero.text")}</Title>
            <SearchBox>
              <CitySelect onClick={() => toggleCityModal()}>
                <Pin />
                <span>{t("homepage.hero.city_select")}</span>
                <Chevron />
              </CitySelect>
              <ProductBox>
                <input
                  onChange={evt => setQ(evt.target.value)}
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
      </div>
    </Suspense>
  );
};

export default Hero;
