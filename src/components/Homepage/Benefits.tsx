import React, { FC } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { BREAKPOINT } from "../../utils/constants";

const Container = styled.section`
  border-radius: 24px;
  background: rgba(240, 240, 240, 0.4);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 357px;

  @media screen and (max-width: ${BREAKPOINT}) {
    margin-top: 64px;
    margin-bottom: 30px;
    min-height: 566px;
  }
`;

const Title = styled.div`
  font-family: 'MontserratMedium';
  font-size: 40px;
  line-height: 40px;
  color: var(--black);
  text-align: center;
  margin: 54px 0 0;
  @media screen and (max-width: ${BREAKPOINT}) {
    font-size: 22px;
    line-height: 20px;
  }
`;

const Text = styled.p`
  font-size: 16px;
  line-height: 120%;
  text-align: center;
  padding: 0;
  width: 461px;
  margin: 34px 0 20px;
  letter-spacing: 0.02em;
  color: var(--font);
  @media screen and (max-width: ${BREAKPOINT}) {
    font-size: 12px;
    line-height: 131%;
    max-width: 300px;
    margin: 10px 0 35px;
  }
`;

const Grid = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  // max-width: 800px;
  // padding: 20px;
  margin: 0 0 66px;
  @media screen and (max-width: ${BREAKPOINT}) {
    flex-direction: column;
  }
`;

const Box = styled.div`
  display: grid;
  grid-template-columns: 56px 250px;
  column-gap: 24px;
  @media screen and (max-width: ${BREAKPOINT}) {
    display: grid;
    column-gap: 16px;
    grid-template-columns: 56px 250px;

    align-items: center;
    margin-bottom: 20px;

    > div {
      text-align: left;
      margin-left: 20px;
    }
  }
  img {
    width: 118px;
    height: 118px;

    @media screen and (max-width: ${BREAKPOINT}) {
      width: 64px;
      height: 64px;
    }
  }
`;

const GridTitle = styled.div`
  font-family: 'MontserratMedium';
  font-size: 16px;
  line-height: 110%;
  margin: 24px 0 16px;
  color: var(--black);

  @media screen and (max-width: ${BREAKPOINT}) {
    margin: 24px 0 8px;
  }
`;

const GridText = styled.div`
  font-size: 14px;
  line-height: 120%;
  letter-spacing: 0.02em;
  color: var(--font);
  max-width: 200px;
`;

const Icon = styled.div`
  place-self: center;
`;

type Props = {};

const Benefits: FC<Props> = () => {
  const { t } = useTranslation();

  return (
    <Container>
      <Title>{t("homepage.benefits.title")}</Title>
      <Text>{t("homepage.benefits.text")}</Text>
      <Grid>
        <Box>
          {/* <img
              width="40px"
              height="40px"
              className="lazyload benefit-icon"
              data-src="/images/delivery.webp"
              alt="benefit"
            /> */}
          <Icon>
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle opacity="0.08" cx="28" cy="28" r="28" fill="#E30613" />
              <g clipPath="url(#clip0)">
                <path d="M22.6801 24.8889V23.3334H35.4093V34.2223H22.6801V32.6667" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
                <path d="M17.9067 30.3334H24.2713" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
                <path d="M19.4978 27.2222H25.8624" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
                <path
                  d="M26.658 23.3334V21C26.658 20.3812 26.9094 19.7877 27.357 19.3501C27.8046 18.9125 28.4117 18.6667 29.0447 18.6667V18.6667C29.6777 18.6667 30.2848 18.9125 30.7324 19.3501C31.18 19.7877 31.4314 20.3812 31.4314 21V23.3334"
                  stroke="#E30613"
                  strokeWidth="2"
                  strokeMiterlimit="10"
                />
              </g>
              <defs>
                <clipPath id="clip0">
                  <rect width="19.0938" height="18.6667" fill="white" transform="translate(17.1111 17.8889)" />
                </clipPath>
              </defs>
            </svg>
          </Icon>

          <div>
            <GridTitle>{t("homepage.benefits.delivery.title")}</GridTitle>
            <GridText>{t("homepage.benefits.delivery.text")}</GridText>
          </div>
        </Box>
        <Box>
          {/* <img
              width="40px"
              height="40px"
              className="lazyload benefit-icon"
              data-src="/images/wallet.webp"
              alt="wallet"
            /> */}
          <Icon>
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle opacity="0.08" cx="28" cy="28" r="28" fill="#E30613" />
              <g clipPath="url(#clip0)">
                <path
                  d="M23.4401 21H21.0534C20.1743 21 19.4622 21.6961 19.4622 22.5556C19.4622 23.415 20.1743 24.1111 21.0534 24.1111"
                  stroke="#E30613"
                  strokeWidth="2"
                  strokeMiterlimit="10"
                  strokeLinecap="square"
                />
                <path d="M23.4401 24.1111V19.4445H34.5781V24.1111" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
                <path
                  d="M36.9649 24.1111H21.0534C20.1743 24.1111 19.4622 23.415 19.4622 22.5555V34.2222C19.4622 35.511 20.5307 36.5555 21.849 36.5555H36.9649V24.1111Z"
                  stroke="#E30613"
                  strokeWidth="2"
                  strokeMiterlimit="10"
                  strokeLinecap="square"
                />
                <path
                  d="M32.1914 31.8889C33.0702 31.8889 33.7826 31.1924 33.7826 30.3333C33.7826 29.4742 33.0702 28.7778 32.1914 28.7778C31.3127 28.7778 30.6003 29.4742 30.6003 30.3333C30.6003 31.1924 31.3127 31.8889 32.1914 31.8889Z"
                  stroke="#E30613"
                  strokeWidth="2"
                  strokeMiterlimit="10"
                  strokeLinecap="square"
                />
              </g>
              <defs>
                <clipPath id="clip0">
                  <rect width="19.0938" height="18.6667" fill="white" transform="translate(18.6667 18.6667)" />
                </clipPath>
              </defs>
            </svg>
          </Icon>

          <div>
            <GridTitle>{t("homepage.benefits.payment.title")}</GridTitle>
            <GridText>{t("homepage.benefits.payment.text")}</GridText>
          </div>
        </Box>
        <Box>
          {/* <img
              width="40px"
              height="40px"
              className="lazyload benefit-icon"
              data-src="/images/bag.webp"
              alt="benefit"
            /> */}
          <Icon>
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle opacity="0.08" cx="28" cy="28" r="28" fill="#E30613" />
              <g clipPath="url(#clip0)">
                <g clipPath="url(#clip1)">
                  <path d="M18.395 19.25H38.0855" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
                  <path d="M28.2402 19.25V22.75" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
                  <path d="M36.2954 22.75H20.1851V36.75H36.2954V22.75Z" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
                  <path
                    d="M28.2402 34.125C30.7118 34.125 32.7153 32.1662 32.7153 29.75C32.7153 27.3338 30.7118 25.375 28.2402 25.375C25.7687 25.375 23.7651 27.3338 23.7651 29.75C23.7651 32.1662 25.7687 34.125 28.2402 34.125Z"
                    stroke="#E30613"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                    strokeLinecap="square"
                  />
                  <path d="M28.2402 29.75L27.3452 28.875" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
                </g>
              </g>
              <defs>
                <clipPath id="clip0">
                  <rect width="21.4805" height="21" fill="white" transform="translate(17.5 17.5)" />
                </clipPath>
                <clipPath id="clip1">
                  <rect width="21.4805" height="21" fill="white" transform="translate(17.5 17.5)" />
                </clipPath>
              </defs>
            </svg>
          </Icon>

          <div>
            <GridTitle>{t("homepage.benefits.order.title")}</GridTitle>
            <GridText>{t("homepage.benefits.order.text")}</GridText>
          </div>
        </Box>
      </Grid>
    </Container>
  );
};

export default Benefits;
