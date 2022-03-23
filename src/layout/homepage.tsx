import React, { FC, Suspense, useEffect } from "react";

import styled from "styled-components";
import { BREAKPOINT } from "../utils/constants";
import useUser from "../hooks/useUser";

import "lazysizes";
import "lazysizes/plugins/unveilhooks/ls.unveilhooks";
import "lazysizes/plugins/blur-up/ls.blur-up.js";
import "lazysizes/plugins/object-fit/ls.object-fit.js";
import "lazysizes/plugins/parent-fit/ls.parent-fit.js";
import { useQuery } from "@apollo/react-hooks";
import { CHECK_TOKEN } from "../graphql/user/queries";
import { token } from "../utils/store";

const Wrapper = styled.div<{ showPromoBar: boolean }>`
  min-height: 100vh;
  margin: 0;
  padding: ${(props) => props.showPromoBar ? "107px 0 0" : "74px 0 0"};
  @media screen and (max-width: ${BREAKPOINT}) {
    padding: 0;
    &.productpage {
      padding-top: 72px !important;
    }
  }
`;

const Loader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  img {
    max-width: 100%;
  }
`;

type Props = {
  page?: string;
};

const LayoutHomepage: FC<Props> = ({ children, page }) => {
  const { data } = useQuery(CHECK_TOKEN, { fetchPolicy: "network-only" });
  const { logout, toggleLoginModal, showPromoBar } = useUser();

  useEffect(() => {
    if (token.get() !== "null" && data && data.checkToken && !data.checkToken.status) {
      logout();
      token.delete();

      setTimeout(() => {
        toggleLoginModal();
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  return (
    <Suspense
      fallback={
        <Loader>
          <img src="/images/loader.svg" width="50px" height="50px" alt="loader" />
        </Loader>
      }
    >
      <Wrapper className={page ? page : ""} showPromoBar={showPromoBar}>{children}</Wrapper>
    </Suspense>
  );
};

export default LayoutHomepage;
