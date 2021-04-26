import React, { FC, Suspense } from "react";

import styled from "styled-components";
import { BREAKPOINT } from "../utils/constants";

import 'lazysizes'
import "lazysizes/plugins/unveilhooks/ls.unveilhooks";
import "lazysizes/plugins/blur-up/ls.blur-up.js";
import "lazysizes/plugins/object-fit/ls.object-fit.js";
import "lazysizes/plugins/parent-fit/ls.parent-fit.js";


const Wrapper = styled.div`
  min-height: 100vh;
  margin: 0;
  padding: 74px 0 0;
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
`

type Props = {
  page?: string;
};

const LayoutHomepage: FC<Props> = ({ children, page }) => {
  return (
  <Suspense fallback={<Loader>
    <img src="/images/loader.svg" width="50px" height="50px" alt="loader" />
  </Loader>}>
    <Wrapper className={page ? page : ""}>{children}</Wrapper>
  </Suspense>

  )
}

export default LayoutHomepage
