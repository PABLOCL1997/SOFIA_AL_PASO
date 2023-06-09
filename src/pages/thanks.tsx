import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { BREAKPOINT } from "../utils/constants";
import { useLocation } from "react-router-dom";

const Thanks = React.lazy(() => import(/* webpackChunkName: "Thanks" */ "../components/Checkout/Steps/Thanks/Thanks"));

const ThanktWrapper = styled.div``;

const Wrapper = styled.div`
  padding: 60px 100px;
  background: var(--bkg);
  @media screen and (max-width: ${BREAKPOINT}) {
    padding: 20px;
  }
`;

const ThanksPage = () => {
  const location = useLocation();
  let params = new URLSearchParams(location.search);

  const [result, setResult] = useState<Array<{ increment_id: string }>>();
  const [isPickup, setIsPickup] = useState<boolean>(false);
  const guestOrder = Boolean(params.get("orderGuest"));

  useEffect(() => {
    if (params.get("ids")) {
      const orders = params
        .get("ids")
        ?.split(",")
        .map((increment_id) => {
          return { increment_id: increment_id };
        });
      setResult(orders);
    }
    if (params.get("pickup")) {
      setIsPickup(true);
    }
  }, []);

  return (
    <Wrapper>
      <ThanktWrapper>{result && result ? <Thanks orders={result} isPickup={isPickup} guestOrder={guestOrder}/> : null}</ThanktWrapper>
    </Wrapper>
  );
};

export default ThanksPage;
