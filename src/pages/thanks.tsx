import React, { FC, useEffect, useState } from "react";
import styled from "styled-components";
import { BREAKPOINT } from "../utils/constants";
import { useHistory, useLocation } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { TODOTIX_ORDER_INFO } from "../graphql/cart/mutations";

const Thanks = React.lazy(() => import(/* webpackChunkName: "Thanks" */ "../components/Checkout/Thanks"));

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
      <ThanktWrapper>{result && result ? <Thanks orders={result} isPickup={isPickup} /> : null}</ThanktWrapper>
    </Wrapper>
  );
};

export default ThanksPage;
