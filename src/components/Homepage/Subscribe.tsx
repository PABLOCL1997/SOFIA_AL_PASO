import React, { FC, Suspense, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

import { BREAKPOINT } from "../../utils/constants";
import { SUBSCRIBE, SET_USER } from "../../graphql/user/mutations";
import { useMutation } from "react-apollo";
import { isValidEmail } from "../../utils/string";

const Cta = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../Cta"));

const Title = styled.h2`
  font-family: MullerMedium;
  font-size: 32px;
  text-align: center;
  letter-spacing: 0.015em;
  color: var(--dark);

  margin-top: 24px;
  
  width: 489px;
  
  @media screen and (max-width: ${BREAKPOINT}) {
    font-size: 22px;

    width: 288px;


    margin-top: 16px;
  }
`;

const InputGroup = styled.div`
  margin: 49px 0;
  display: flex;
  width: 610px;
  background: #FFFFFF;
  border-radius: 30px;
  input {
    font-family: MullerMedium;
    font-size: 14px;
    line-height: 14px;

    background: none;
    border: 0;
    padding: 15px 30px;
    flex: 1;
    z-index: 1;
  }
  @media screen and (max-width: ${BREAKPOINT}) {
    margin: 32px 0;
    width: 256px;
    background: none;

    flex-direction: column;
    input {
      background: #FFFFFF;
      text-align: center;
      border-radius: 30px;
    }
  }
`;
const CtaWrapper = styled.div`
  button {
    padding: 15px 40px;
    text-transform: uppercase;
    span {
      font-family: MullerBold;
      font-size: 12px;
      line-height: 12px;
    }
    @media screen and (max-width: ${BREAKPOINT}) {
      width: 100%;
      margin-top: 16px;
    }
  }
`;

const Image = styled.img`
  transform: rotate(90deg);
  width: calc(100% + 15px);
  margin-bottom: -55px;
  @media screen and (max-width: ${BREAKPOINT}) {
    width: calc(100% - 30px);
    max-width: 260px;
    margin: 20px 0 10px;
  }
`;
Image.displayName = "ImageSuscribe";

const Wrapper = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 409px;
  background-color: RGBA(254,205,0,0.4);
`

const IconWrapper = styled.div`
  display: block;
  margin-top: 80px;
  @media screen and (max-width: ${BREAKPOINT}) {
    margin-top: 72px;
  }
`

const ImageTomato = styled.div`
  position: absolute;
  bottom: -37%;
  left:0;
  @media screen and (max-width: ${BREAKPOINT}) {
    display: none;
  }
`

const ImageCarrot = styled.div`
  position: absolute;
  top: 54px;
  left: 107px;
  @media screen and (max-width: ${BREAKPOINT}) {
    display: none;
  }
`

const ImageWeath = styled.div`
  position: absolute;
  right: 91px;
  top: -12%;
  @media screen and (max-width: ${BREAKPOINT}) {
    display: none;
  }
`

const ImagePepper = styled.div`
  position: absolute;
  top:67px;
  right: 0;
  @media screen and (max-width: ${BREAKPOINT}) {
    display: none;
  }
`

const ImageMushrooms = styled.div`
  position: absolute;
  top: 122px;
  right: 0px;
  @media screen and (max-width: ${BREAKPOINT}) {
    display: none;
  }
`

const ImageTomatoMobile = styled.div`
  display: none;
  @media screen and (max-width: ${BREAKPOINT}) {
    display: block;
    position: absolute;
    bottom: -28%;
    left: 0;
  }

`
const ImageWeathMobile = styled.div`
  display: none;
  @media screen and (max-width: ${BREAKPOINT}) {
    display: block;
    position: absolute;
    right: 0;
    bottom: 0;
  }

`
const ImageCarrotsMobile = styled.div`
  display: none;
  @media screen and (max-width: ${BREAKPOINT}) {
    display: block;
    position: absolute;
    top: -8%;
    left: 0;
  }

`

type Props = {};

const Subscribe: FC<Props> = () => {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [subscribe] = useMutation(SUBSCRIBE, { variables: { email } });
  const [showError] = useMutation(SET_USER, {
    variables: { user: { showError: t("homepage.subscribe.error") } }
  });
  const [showSuccess] = useMutation(SET_USER, {
    variables: { user: { showSuccess: t("homepage.subscribe.success") } }
  });

  const doSubscribe = async () => {
    try {
      if (!isValidEmail(email)) throw new Error("");
      const response = await subscribe();
      if (response.data.subscribe.status) showSuccess();
      else showError();
    } catch (e) {
      showError();
    }
  };

  return (
      <Suspense fallback={<span></span>}>
        <Wrapper>
          <ImageTomato>
            <img src="/images/tomate-desktop.webp" alt="Tomate" width="261px" height="306px" className="lazyload" />
          </ImageTomato>
          <ImageCarrot>
            <img src="/images/zanahorias-desktop.webp" alt="Zanahoria" width="184px" height="332px" className="lazyload" />
          </ImageCarrot>
          <ImageWeath>
            <img src="/images/trigo-desktop.webp" alt="Trigo" width="252px" height="285px" className="lazyload" />
          </ImageWeath>
          <ImagePepper>
            <img src="/images/morron-desktop.webp" alt="Pimiento" width="131px" height="164px" className="lazyload" />
          </ImagePepper>
          <ImageMushrooms>
            <img src="/images/hongos-desktop.webp" alt="Hongos" width="239px" height="360px" className="lazyload" />
          </ImageMushrooms>

          <ImageCarrotsMobile>
            <img src="/images/zanahoria-mobile.webp" alt="Zanahoria" width="146px" height="215px" className="lazyload" />
          </ImageCarrotsMobile>

          <ImageWeathMobile>
            <img src="/images/trigo-mobile.webp" alt="Trigo" width="148px" height="291px" className="lazyload" />
          </ImageWeathMobile>

          <ImageTomatoMobile>
            <img src="/images/tomate-mobile.webp" alt="Tomate" width="159px" height="216px" className="lazyload" />
          </ImageTomatoMobile>
          
          <IconWrapper>

            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 2H8L10 20H28L32 8H14" stroke="#E30613" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11 32C12.6569 32 14 30.6569 14 29C14 27.3431 12.6569 26 11 26C9.34315 26 8 27.3431 8 29C8 30.6569 9.34315 32 11 32Z" stroke="#E30613" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M27 32C28.6569 32 30 30.6569 30 29C30 27.3431 28.6569 26 27 26C25.3431 26 24 27.3431 24 29C24 30.6569 25.3431 32 27 32Z" stroke="#E30613" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </IconWrapper>

          <Title>{t("homepage.subscribe.title")}</Title>
          <InputGroup>
            <input
              value={email}
              onChange={$evt => setEmail($evt.target.value)}
              placeholder={t("homepage.subscribe.mail")}
              type="email"
            />
            <CtaWrapper>
              <Cta
                filled={true}
                text={t("homepage.subscribe.button")}
                action={doSubscribe}
              />
            </CtaWrapper>
          </InputGroup>
        </Wrapper>
      </Suspense>
  );
};

export default Subscribe;
