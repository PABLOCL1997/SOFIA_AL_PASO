import React, { FC, Suspense, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { BREAKPOINT } from "../utils/constants";
import { useQuery, useMutation } from "react-apollo";
import { CHECK_TOKEN } from "../graphql/user/queries";
import { SET_USER } from "../graphql/user/mutations";
import { token } from "../utils/store";
import 'lazysizes'
import "lazysizes/plugins/unveilhooks/ls.unveilhooks";
import "lazysizes/plugins/blur-up/ls.blur-up.js";
import "lazysizes/plugins/object-fit/ls.object-fit.js";
import "lazysizes/plugins/parent-fit/ls.parent-fit.js";
import useUser from "../hooks/useUser";

const Loader = React.lazy(() =>
  import(/* webpackChunkName: "Loader" */ "../components/Loader")
);
const Error = React.lazy(() =>
  import(/* webpackChunkName: "Error" */ "../components/Error")
);
const Success = React.lazy(() =>
  import(/* webpackChunkName: "Success" */ "../components/Success")
);
const MinimumPrice = React.lazy(() =>
  import(/* webpackChunkName: "MinimumPrice" */ "../components/MinimumPrice")
);
const Modal = React.lazy(() =>
  import(/* webpackChunkName: "ModalMessage" */ "../components/ModalMessage")
);
const Header = React.lazy(() =>
  import(/* webpackChunkName: "Header" */ "../components/Header/Header")
);
const Footer = React.lazy(() =>
  import(/* webpackChunkName: "Footer" */ "../components/Footer")
);

const Wrapper = styled.div`
  padding: 113px 0 0;
  @media screen and (max-width: ${BREAKPOINT}) {
    padding: 0;
    &.productpage {
      // padding-top: 72px !important;
    }
  }
`;

const Content = styled.div`
  min-height: 100vh;
`;

type Props = {
  page?: string;
};

const LayoutGeneral: FC<Props> = ({ children, page }) => {
  const { logout, toggleLoginModal } = useUser();
  const history = useHistory();
  const [checkout, setCheckout] = useState(
    history.location.pathname === "/checkout"
  );
  const { data } = useQuery(CHECK_TOKEN, { fetchPolicy: "network-only" });
  
  useEffect(() => {
      // when user is on any page with token but expired
    if (
      token.get() !== "null" &&
      data &&
      data.checkToken &&
      !data.checkToken.status
    ) {
      logout();
      token.delete();

      setTimeout(() => {
        toggleLoginModal();
      }, 0);
    }

    // when user is on mi-cuenta without token
    if (token.get() == "null" && history.location.pathname.indexOf('mi-cuenta') > 0) {
      logout();
      token.delete();

      setTimeout(() => {
        toggleLoginModal();
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    let url = history.location.pathname;
    const unlisten = history.listen(() => {
      let {
        location: { pathname }
      } = history;
      setCheckout(pathname === "/checkout");
      if (
        pathname !== url &&
        (pathname === "/" || pathname.indexOf("/productos") >= 0)
      ) {
        url = pathname;
        window.scrollTo(0, 0);
      }
    });
    return () => {
      unlisten();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Suspense fallback={<Loader />}>
      <Wrapper className={page ? page : ""}>
        <Header checkout={checkout} page={page} />
        <Content>{children}</Content>
        <Footer page={page} />
        <Error />
        <Success />
        <MinimumPrice />
        <Modal />
      </Wrapper>
    </Suspense>
  );
};

export default LayoutGeneral;
