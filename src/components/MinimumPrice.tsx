import React, { FC, useEffect, useState } from "react";
import styled from "styled-components";
import { useQuery, useMutation } from "react-apollo";
import { GET_USER } from "../graphql/user/queries";
import { SET_USER } from "../graphql/user/mutations";

import WarningIcon from "../assets/images/warning-input.svg"
import useCityPriceList from "../hooks/useCityPriceList";
import useMinimumPrice from "../hooks/useMinimumPrice";

const Container = styled.span`
  position: fixed;
//   display: none;

  align-items: center;
  background: #F0F0F0;
  color: var(--black);
  width: 80vw;
  top: 128px;
  left: 120px;
  padding: 23px 24px;
  font-size: 14px;
  box-shadow: 0px 17px 36px rgba(0, 0, 0, 0.13);
  transform: translateX(calc(200%));
  transition: transform 0.3s linear;
  z-index: 5;

  line-height: 1.5em;
  border-radius: 16px;
  &.visible {
    transform: translateX(0px);
  }

  img {
      margin-right: 16px;
      margin-top: -4px;
  }

  b {
      font-family: MullerBold;
  }
`;

const CloseWrapper = styled.div`
  position: absolute;
  right: 15px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  > svg {
    width: 12px;
    height: 12px;
  }
`;

type Props = {};

const MinimumPrice: FC<Props> = () => {
  const { data } = useQuery(GET_USER, {});
  const { agency } = useCityPriceList();
  const minimumPrice = useMinimumPrice();
  const AgencyMinimumPrice: number = 100;
  const [visible, setVisible] = useState(false);

  const [hideSuccess] = useMutation(SET_USER, {
    variables: { user: { showMinimumPrice: "" } }
  });

  useEffect(() => {
    hideSuccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data.userInfo.length
      && data.userInfo[0].showMinimumPrice
      && data.userInfo[0].showMinimumPrice.length > 0) {
        setVisible(true);
        setTimeout(
          () => {
            hideSuccess();
            setVisible(false);
          },
        3000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <Container
      className={
        agency && visible && minimumPrice < AgencyMinimumPrice ? "visible" : ""
      }
    >
        <CloseWrapper onClick={() => hideSuccess()}>
        {/* close */}
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2L2 16" stroke="#808080" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
            <path d="M16 16L2 2" stroke="#808080" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
        </svg>
        </CloseWrapper>
      <img src={WarningIcon} alt="warning" />
      <span>Recordá que el límite de compra al retirar al paso es de <b>Bs. {minimumPrice}</b>.</span>
    </Container>
  );
};

export default MinimumPrice;
