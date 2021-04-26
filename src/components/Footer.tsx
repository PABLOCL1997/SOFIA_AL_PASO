import React, { FC, Suspense } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { BREAKPOINT } from "../utils/constants";
import { Link } from "react-router-dom";
import Loader from "./Loader";

const Container = styled.div<{ page?: string }>`
  background: var(--black);
  padding: 40px;
  .main-container {
    display: flex;
    flex-direction: row;
    @media screen and (max-width: ${BREAKPOINT}) {
      flex-direction: column;
      display: ${props => (props.page === "productpage" ? "none" : "")};
    }
  }
  @media screen and (max-width: ${BREAKPOINT}) {
    background: ${props =>
      props.page === "productpage" ? "none" : "var(--black)"};
    min-height: ${props => (props.page === "productpage" ? "108px" : "")};
  }
`;

const Col1 = styled.div`
  width: 50%;
  margin-right: 110px;
  > img {
 /*    width: 80px; */
  }
  @media screen and (max-width: ${BREAKPOINT}) {
    width: 100%;
    margin-right: 0;
    .copy {
      display: none;
    }
  }
`;

const Col2 = styled.div`
  .copy {
    display: none;
  }
  @media screen and (max-width: ${BREAKPOINT}) {
    .copy {
      display: block;
    }
  }
`;

const Text = styled.p`
  font-family: MullerBold;
  font-weight: bold;
  padding: 40px 0 10px;
  font-size: 24px;
  line-height: 31px;
  letter-spacing: 0.015em;
  color: white;
`;

const Copy = styled.p`
  font-size: 12px;
  line-height: 12px;
  letter-spacing: 0.015em;
  color: var(--red);
  margin-top: 10px;
  a {
    color: var(--red);
  }
`;
const Slogan = styled.h2`
  font-family: MullerBold;
  font-size: 20px;
  line-height: 20px;
  letter-spacing: 0.015em;
  color: white;
  margin-top: 40px;
`;

const Contact = styled.p`
  font-size: 14px;
  line-height: 14px;
  letter-spacing: 0.015em;
  color: white;
  margin: 10px 0 20px;
`;

const IconBox = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`;

const IconText = styled.div`
  margin-left: 10px;
  flex: 1;
`;

const Line1 = styled.p`
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.015em;
  color: white;
`;

type Props = {
  page?: string;
};

const Footer: FC<Props> = ({ page }) => {
  const { t } = useTranslation();

  return (
    <Suspense fallback={<Loader />}>
      <Container page={page}>
        <div className="main-container">
          <Col1>
            <Text>{t("footer.text")}</Text>
            <img
              src={"https://d10nbigpolte6j.cloudfront.net/images/sofia-logo.webp"}
              className="lazyload"
              width="119px"
              height="80px"
              alt="Sofía Logo"
            />
            <Copy className="copy">
              {t("footer.copy", { year: new Date().getFullYear() })}
            </Copy>
            <Copy>
              <Link to="/terminos-y-condiciones">{t("footer.terms")}</Link>
            </Copy>
          </Col1>
          <Col2>
            <Slogan>{t("footer.slogan")}</Slogan>
            <Contact>{t("footer.contact")}</Contact>
            <IconBox>
              {/* phone */}
              <svg xmlns="http://www.w3.org/2000/svg" width="28" x="0px" y="0px" viewBox="0 0 30.4 31.3" >
                <g id="_x39_">
                  <path fill="#E11E26" d="M21.9,12.2c0.5,1.1,0.8,2.3,0.8,3.5c0,0.7,0.5,1.2,1.2,1.2h0c0.7,0,1.2-0.5,1.2-1.2c0-1.6-0.3-3.1-1-4.5
              c-0.9-1.8-2.2-3.3-3.9-4.3c-1.6-1-3.5-1.6-5.4-1.6c-0.7,0-1.2,0.5-1.2,1.2c0,0.7,0.5,1.2,1.2,1.2C17.8,7.7,20.5,9.5,21.9,12.2z"/>
                  <path fill="#E11E26" d="M28.8,8.9c-1.3-2.7-3.3-4.9-5.9-6.5C20.5,0.8,17.7,0,14.8,0c0,0,0,0,0,0c-0.7,0-1.2,0.5-1.2,1.2
              c0,0.7,0.5,1.2,1.2,1.2c5.1,0,9.7,2.9,11.9,7.5c0.9,1.8,1.3,3.8,1.3,5.8c0,0.7,0.5,1.2,1.2,1.2c0,0,0,0,0,0c0.7,0,1.2-0.5,1.2-1.2
              C30.4,13.4,29.9,11,28.8,8.9z"/>
                  <path fill="#E11E26" d="M24.8,21.3c-0.4-0.5-1-0.7-1.6-0.7c-0.5,0-0.9,0.1-1.3,0.4l-2.5,1.6c-0.5-0.2-2.2-1.2-6.1-5.3
              c-3.9-4.2-4.7-5.9-4.9-6.4l1.8-2.4c0.7-0.9,0.6-2.1-0.1-2.9l-4-4.2C5.6,0.8,5,0.5,4.4,0.5C3.7,0.5,3,0.8,2.6,1.4L1.5,2.7
              C0.5,3.9,0,5.3,0,7c0,1.5,0.4,3.2,1.2,5c1.3,3.1,3.8,6.6,7,10c1.7,1.8,4.3,4.3,7.3,6.3c2.9,1.9,5.5,2.9,7.7,2.9
              c1.4,0,2.7-0.4,3.8-1.2l1.4-1c0.6-0.4,0.9-1,1-1.7c0.1-0.7-0.2-1.3-0.6-1.8L24.8,21.3z"/>
                </g>
              </svg>
              <IconText>
                <Line1>{t("footer.phone")}</Line1>
                <Line1>800124141</Line1>
              </IconText>
            </IconBox>
            <IconBox>
              {/* mail */}
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="28" height="26" x="0px" y="0px">
                <g id="_x36_">
                  <path fill="#E11E26" d="M14.7,12.7c-0.2,0.1-0.3,0.1-0.5,0.1c-0.2,0-0.4,0-0.5-0.1L0.4,4.9C0.2,4.8,0,4.9,0,5.1V17
              c0,1.2,1,2.2,2.2,2.2h23.9c1.2,0,2.2-1,2.2-2.2V5.1c0-0.2-0.2-0.4-0.4-0.3L14.7,12.7z"/>
                  <path fill="#E11E26" d="M14.8,10.2l13.4-7.9c0.1-0.1,0.2-0.2,0.1-0.3c-0.1-1.1-1.1-2-2.2-2H2.2C1.1,0,0.1,0.9,0,2c0,0.1,0,0.2,0.1,0.3
              l13.4,7.9C13.9,10.5,14.4,10.5,14.8,10.2z"/>
                </g>
              </svg>
              <IconText>
                <Line1>{t("footer.mail")}</Line1>
                <Line1>info@sofia.com.bo</Line1>
              </IconText>
            </IconBox>
            <Copy className="copy">
              {t("footer.copy", { year: new Date().getFullYear() })}
            </Copy>
          </Col2>
        </div>
      </Container>
    </Suspense>
  );
};

export default Footer;
