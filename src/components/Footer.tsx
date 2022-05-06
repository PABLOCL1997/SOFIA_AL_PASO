import React, { FC, Suspense, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { BREAKPOINT } from "../utils/constants";
import Loader from "./Loader";
import PhoneImg from "../assets/images/footer-phone.svg";
import EmailImg from "../assets/images/footer-email.svg";

import { useQuery } from "react-apollo";
import { GET_PAGES } from "../graphql/metadata/queries";

const Container = styled.div<{ page?: string }>`
  background: var(--black);
  padding: 40px;
  display: flex;
  flex-direction: row;
  @media screen and (max-width: ${BREAKPOINT}) {
    flex-direction: column;
    display: ${(props) => (props.page === "productpage" ? "none" : "")};
  }
  @media screen and (max-width: ${BREAKPOINT}) {
    background: ${(props) => (props.page === "productpage" ? "none" : "var(--black)")};
    min-height: ${(props) => (props.page === "productpage" ? "108px" : "")};
  }
`;

const Text = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-weight: bold;
  font-size: 19px;
  padding: 0 20% 10px 0px;
  line-height: 31px;
  letter-spacing: 0.015em;
  color: white;

  @media screen and (max-width: ${BREAKPOINT}) {
    padding: 0;
  }
`;

const Disclaimer = styled.p`
  font-size: 12px;
  color: white;
  grid-column-start: 1;
  grid-column-end: 3;
  @media screen and (max-width: ${BREAKPOINT}) {
    margin-top: 40px;
  }
`;

const Slogan = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-weight: bold;
  font-size: 20px;
  line-height: 20px;
  letter-spacing: 0.015em;
  color: white;
  margin-top: 5px;

  @media screen and (max-width: ${BREAKPOINT}) {
    margin-top: 40px;
  }
`;

const Contact = styled.p`
  font-size: 14px;
  line-height: 14px;
  letter-spacing: 0.015em;
  color: white;
  margin: 10px 0 20px;
  @media screen and (max-width: ${BREAKPOINT}) {
    margin: 10px 0 20px;
  }
`;

const Line1 = styled.p`
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.015em;
  color: white;
`;

const Anchor = styled.a`
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  color: white;
`;

const FooterWrapper = styled.div`
  display: grid;
  padding: 30px;
  grid-template-columns: 60% 40%;
  grid-column-gap: 20px;
  > ul {
    display: none;
  }
  @media screen and (max-width: ${BREAKPOINT}) {
    grid-template-columns: 100%;
    > ul {
      display: block;
      color: white;
      margin: 35px 0 0 0;

      > li {
        margin-bottom: 20px;

        div {
          width: 160px;
          font-weight: 800;

          &:after {
            content: "+";
            float: left;
            position: relative;
            left: 140px;
            width: 0;
          }

          &.open {
            &:after {
              content: "x";
              float: left;
              position: relative;
              left: 140px;
              width: 0;
            }
          }
        }

        > ul {
          display: none;

          &.open {
            display: block;
          }

          margin: 20px 0;
          font-weight: 200;

          > li {
            margin-bottom: 20px;
          }
        }
      }
    }
  }
`;

const FooterHeaderImg = styled.div`
  grid-column-start: 1;
  grid-column-end: 3;
  margin-bottom: 20px;
  @media screen and (max-width: ${BREAKPOINT}) {
    grid-column: unset;
  }
`;

const TablaMagento = styled.div`
  overflow: auto;
  > table {
    margin: 20px 0 0 0;
    padding: 0;
    color: white;
    width: 100%;
    text-align: left;
    border-collapse: collapse;

    @media screen and (max-width: ${BREAKPOINT}) {
      display: none;
    }

    tr {
      th {
        width: 120px;
        font-weight: 600;
        padding: 0 20px 20px 0;

        @media screen and (max-width: ${BREAKPOINT}) {
          &:first-child {
            display: none;
          }
          &:nth-child(3) {
            display: none;
          }
          &:nth-child(5) {
            display: none;
          }
        }
      }

      td {
        padding-bottom: 15px;
        padding-right: 40px;
        a {
          text-decoration: none;
        }
      }
    }
    tr:first-child {
      height: 30px;
    }
  }
`;

const ContactWrapper = styled.div`
  display: grid;
  margin-top: 30px;

  @media screen and (min-width: ${BREAKPOINT}) {
    > div:first-child {
      display: none;
    }
  }

  @media screen and (max-width: ${BREAKPOINT}) {
    margin-top: 0;
    > div:first-child {
      margin-top: 10px;
    }
    > div:nth-child(2) {
      margin-bottom: 20px;
    }
  }
`;

const ContactDiv = styled.div`
  @media screen and (max-width: ${BREAKPOINT}) {
    grid-column-start: 1;
    grid-column-end: 3;
  }
  > div {
    display: inline-block;
    vertical-align: middle;
    margin-right: 15px;
  }
  > img {
    margin-right: 15px;
  }
`;

const DisclaimerDivider = styled.div`
  width: 32px;
  height: 4px;
  border-bottom: 4px solid red;
  margin-top: 20px;
`;

const SloganDiv = styled.div`
  @media screen and (max-width: ${BREAKPOINT}) {
    display: none;
  }
`;

type Props = {
  page?: string;
};

const Footer: FC<Props> = ({ page }) => {
  const { t } = useTranslation();
  const [table, setTable] = useState("");
  const [footerList, setFooterList] = useState<any>([]);
  const { data: dynamicFooter } = useQuery(GET_PAGES, {
    fetchPolicy: "network-only",
    variables: { identifier: "footer-dinamico" },
    onCompleted: (d) => {
      if (d.pages && d.pages.length > 0) {
        let categories = d.pages[0].content.split("<th>");
        categories.shift();
        categories.forEach((cat: any, i: number) => {
          categories[i] = cat.slice(0, cat.indexOf("</th>"));
        });
        let items = d.pages[0].content.split("<td>");
        items.shift();
        items.forEach((item: any, i: number) => {
          items[i] = item.slice(0, item.indexOf("</td>"));
        });
        let list = [
          ...categories.map((cat: any, i: number) => {
            return { id: i + 1, name: cat, items: [], active: false };
          }),
        ];
        for (let i = 0; i < categories.length; i++) {
          let item_index = 1;
          for (let j = 0; j < items.length; j += categories.length) {
            if (items[j + i] !== "&nbsp;") {
              list[i].items.push({ id: item_index, name: items[j + i] });
              item_index++;
            }
          }
        }
        setFooterList(list);
        setTable(d.pages[0].content);
      }
    },
  });

  const openFooterItem = (e: any) => {
    let list = [...footerList];
    list = list.map((item: any) => {
      if (item.id == e) {
        item.active = !item.active;
      }
      return item;
    });
    setFooterList(list);
  };

  return (
    <Suspense fallback={<Loader />}>
      <Container page={page}>
        <FooterWrapper>
          <FooterHeaderImg>
            <img src={"https://d10nbigpolte6j.cloudfront.net/images/sofia-logo.webp"} className="lazyload" width="80px" alt="Sofía Logo" />
          </FooterHeaderImg>
          <Text>{t("footer.text")}</Text>
          <SloganDiv>
            <Slogan>{t("footer.slogan")}</Slogan>
            <Contact>{t("footer.contact")}</Contact>
          </SloganDiv>
          {footerList && (
            <ul>
              {footerList.map((item: any) => {
                return (
                  <li key={`${item.id}-0`}>
                    <div onClick={() => openFooterItem(item.id)} className={item.active ? "open" : ""}>
                      {item.name}
                    </div>
                    <ul className={item.active ? "open" : ""}>
                      {item.items.map((item2: any) => {
                        return <li key={`${item.id}-${item2.id}`} dangerouslySetInnerHTML={{ __html: item2.name }}></li>;
                      })}
                    </ul>
                  </li>
                );
              })}
            </ul>
          )}
          <TablaMagento dangerouslySetInnerHTML={{ __html: table }}></TablaMagento>
          <ContactWrapper>
            <div>
              <Slogan>{t("footer.slogan")}</Slogan>
              <Contact>{t("footer.contact")}</Contact>
            </div>
            <ContactDiv>
              <img src={PhoneImg} alt="Telefono" />
              <div>
                <Line1>{t("footer.phone")}</Line1>
                <Anchor href="tel:800124141">800124141</Anchor>
              </div>
            </ContactDiv>
            <ContactDiv>
              <img src={EmailImg} alt="Email" />
              <div>
                <Line1>{t("footer.mail")}</Line1>
                <Anchor href="mailto:info@sofia.com.bo">info@sofia.com.bo</Anchor>
              </div>
            </ContactDiv>
            <Disclaimer>
              {t("footer.copy", { year: new Date().getFullYear() })}
              <DisclaimerDivider></DisclaimerDivider>
            </Disclaimer>
          </ContactWrapper>
        </FooterWrapper>
      </Container>
    </Suspense>
  );
};

export default Footer;
