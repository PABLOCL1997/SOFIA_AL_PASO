import React, { FC, Suspense, useEffect, useMemo, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import { BREAKPOINT } from "../utils/constants";
import { useQuery } from "react-apollo";
import { CHECK_TOKEN } from "../graphql/user/queries";
import { token } from "../utils/store";
import "lazysizes";
import "lazysizes/plugins/unveilhooks/ls.unveilhooks";
import "lazysizes/plugins/blur-up/ls.blur-up.js";
import "lazysizes/plugins/object-fit/ls.object-fit.js";
import "lazysizes/plugins/parent-fit/ls.parent-fit.js";
import useUser from "../hooks/useUser";
import { Location } from "../context/Location"
import { Courtain } from "../context/Courtain"
import { useUrlQuery } from "../hooks/useUrlQuery";


const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../components/Loader"));
const Error = React.lazy(() => import(/* webpackChunkName: "Error" */ "../components/Error"));
const Success = React.lazy(() => import(/* webpackChunkName: "Success" */ "../components/Success"));
const MinimumPrice = React.lazy(() => import(/* webpackChunkName: "MinimumPrice" */ "../components/MinimumPrice"));
const Modal = React.lazy(() => import(/* webpackChunkName: "ModalMessage" */ "../components/ModalMessage"));
const Header = React.lazy(() => import(/* webpackChunkName: "Header" */ "../components/Header/Header"));
const Footer = React.lazy(() => import(/* webpackChunkName: "Footer" */ "../components/Footer"));

const Wrapper = styled.div`
  padding: 74px 0 0;
  @media screen and (max-width: ${BREAKPOINT}) {
    padding: 0;
    &.productpage {
      padding-top: 0px;
    }
  }
`;


export const LoadingCourtain = styled.div<{ isLoading: boolean }>`
  display: none;

  ${({ isLoading }) => isLoading && `
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  z-index: 400;

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to { 
      transform: rotate(360deg);
    }
  }
 

 @-webkit-keyframes rotate {
    from {
      -webkit-transform: rotate(0deg);
    }
    to { 
      -webkit-transform: rotate(360deg);
    }
  }

.load {
	width: 60px;
	height: 60px;
	border:solid 6px var(--red);
	border-radius: 50%;
	border-right-color: transparent;
	border-bottom-color: transparent;
  -webkit-transition: all 0.5s ease-in;
  -webkit-animation-name: rotate; 
  -webkit-animation-duration: 1.0s; 
  -webkit-animation-iteration-count: infinite;
  -webkit-animation-timing-function: linear;
    
  transition: all 0.5s ease-in;
  animation-name: rotate; 
  animation-duration: 1.0s; 
  animation-iteration-count: infinite;
  animation-timing-function: linear; 
}
`}
`;
Wrapper.displayName = "GeneralWrapper";


const Content = styled.div<{ pageUrl?: string }>`
  min-height: ${(props) => (!props.pageUrl || props.pageUrl === "/" ? "auto" : "100vh")};
`;

type Props = {
  page?: string;
};

const LayoutGeneral: FC<Props> = ({ children, page }) => {
  const { logout, toggleLoginModal } = useUser();
  const history = useHistory();
  let query = useUrlQuery();

  const [checkout, setCheckout] = useState(history.location.pathname === "/checkout");
  const { data } = useQuery(CHECK_TOKEN, { fetchPolicy: "network-only" });
  const step = useMemo(() => {
    if (query.get("step")) {
      return query.get("step") || "";
    }
    return ""
  }, [query]);

  const [isLoading, setIsLoading] = useState<boolean>(false);


  useEffect(() => {
    // when user is on any page with token but expired
    if (token.get() !== "null" && data && data.checkToken && !data.checkToken.status) {
      logout();
      token.delete();

      setTimeout(() => {
        toggleLoginModal();
      }, 0);
    }

    // when user is on mi-cuenta without token
    if (token.get() == "null" && history.location.pathname.indexOf("mi-cuenta") > 0) {
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
        location: { pathname },
      } = history;
      setCheckout(pathname === "/checkout");
      if (pathname !== url && (pathname === "/" || pathname.indexOf("/productos") >= 0)) {
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
      <Courtain.Context.Provider value={{ loading: isLoading, setLoading: setIsLoading }}>
        <Wrapper className={page || ""}>
          <LoadingCourtain isLoading={isLoading}>
            <div className="load"></div>
          </LoadingCourtain>
          <Location.Context.Provider value={step}>
            <Header checkout={checkout} page={page} />
            <Content>{children}</Content>
          </Location.Context.Provider>
          <Footer page={page} />
          <Error />
          <Success />
          <MinimumPrice />
          <Modal />
        </Wrapper>
      </Courtain.Context.Provider>
    </Suspense>
  );
};

export default LayoutGeneral;
