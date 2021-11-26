import React, { FC, useEffect } from "react";
import styled from "styled-components";
import { useQuery, useMutation } from "react-apollo";
import { GET_USER } from "../graphql/user/queries";
import { SET_USER } from "../graphql/user/mutations";

const Container = styled.span`
  position: fixed;
  background: var(--red);
  color: white;
  bottom: 0;
  right: 0;
  padding: 12px 50px 12px 15px;
  border: 0;
  font-size: 20px;
  font-weight: bold;
  box-shadow: 2px 2px 2px #e306137d;
  transform: translateY(50px);
  transition: transform 0.3s linear;
  z-index: 5;
  width: 100%;
  &.visible {
    transform: translateY(0);
  }
`;

type Props = {};

const Error: FC<Props> = () => {
  const { data } = useQuery(GET_USER, {});
  const [hideError] = useMutation(SET_USER, {
    variables: { user: { showError: "" } },
  });

  useEffect(() => {
    hideError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data.userInfo.length && data.userInfo[0].showError) {
      setTimeout(() => {
        hideError();
      }, 8000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return <Container className={data?.userInfo.length && data?.userInfo[0].showError ? "visible" : ""}>{data?.userInfo.length ? data?.userInfo[0].showError : ""}</Container>;
};

export default Error;
