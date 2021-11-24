import React, { Suspense, FC, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { MY_ACCOUNT_TITLE } from "../meta";
import { token } from "../utils/store";
import { useQuery } from "@apollo/react-hooks";
import { CHECK_TOKEN } from "../graphql/user/queries";
import useUser from "../hooks/useUser";

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../components/Loader"));
const Container = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../components/MyAccount/Container/Container"));

type Props = {};

const MyAccount: FC<Props> = () => {
  const history = useHistory();
  const { data } = useQuery(CHECK_TOKEN, { fetchPolicy: "network-only" });
  const { logout } = useUser();

  useEffect(() => {
    document.title = MY_ACCOUNT_TITLE;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // when user is on micuenta page with token but expired or
    // when user is on mi-cuenta without token
    if ((token.get() !== "null" && data && data.checkToken && !data.checkToken.status) || token.get() === "null") {
      logout();
      token.delete();

      setTimeout(() => history.push("/?login=true"), 0);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <Suspense fallback={<Loader />}>
      <Container />
    </Suspense>
  );
};

export default MyAccount;
