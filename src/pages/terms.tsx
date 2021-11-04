import React, { Suspense, FC, useEffect } from "react";
import styled from "styled-components";
import { BREAKPOINT } from "../utils/constants";
import { TERMS_TITLE } from "../meta";
import { useTranslation } from "react-i18next";
import { useQuery } from "@apollo/react-hooks";
import { GET_PAGES } from "../graphql/metadata/queries";

const Loader = React.lazy(() =>
  import(/* webpackChunkName: "Loader" */ "../components/Loader")
);

const Header = styled.div`
  position: relative;
  padding: 84px 0;
  text-align: center;
  box-shadow: 0px -1px 52px rgba(0, 0, 0, 0.08);

  h2 {
    font-family: MullerMedium;
    font-size: 40px;
    line-height: 1.5em;
    color: var(--black);
  }

  &:after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: -4px;
    margin-left: -40px;
    width: 80px;
    height: 8px;
    border-radius: 15px;
    background: var(--red);
  }

  @media screen and (max-width: ${BREAKPOINT}) {
    padding: 40px 20px;
  }
`;

const QuestionWrapper = styled.main`
  section {
    max-width: 688px;
    padding: 0 20px 20px;
    margin: 50px auto;

    h2 {
      font-family: MullerMedium;
      font-size: 18px;
      line-height: 1.5em;
      letter-spacing: 0.01em;
      color: var(--black);
      margin-bottom: 16px;
      margin-top: 32px;
    }

    p {
      font-size: 14px;
      line-height: 1.5em;
      letter-spacing: 0.01em;
      color: var(--black);
      display: block;
    }
  }
`;

type Props = {};
const Terms: FC<Props> = () => {
  const { t } = useTranslation();
  const { data: terms } = useQuery(GET_PAGES, {
    fetchPolicy: "network-only",
    variables: { identifier: "terminos-y-condiciones" }
  })

  useEffect(() => {
    document.title = TERMS_TITLE;
  }, []);

  return (
    <Suspense fallback={<Loader />}>
        <Header>
          <div className="main-container">
            <h2>{t("footer.terms")}</h2>
          </div>
        </Header>
        {terms && terms.pages && terms.pages.length > 0 && terms.pages[0].content && 
          <QuestionWrapper dangerouslySetInnerHTML={{ __html: terms.pages[0].content }} />
        }
    </Suspense>
  );
};

export default Terms;
