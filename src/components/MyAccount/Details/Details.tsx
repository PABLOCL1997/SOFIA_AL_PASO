import React, { Suspense, FC, useEffect } from "react";
import { DETAILS, GET_USER } from "../../../graphql/user/queries";
import { useLazyQuery, useQuery } from "react-apollo";
import { Wrapper, GridDatos } from "./style";

import { DesktopAndTablet } from "../../../components/ResponsiveContainers";
import { useTranslation } from "react-i18next";

const CardAccount = React.lazy(() => import(/* webpackChunkName: "CardAccount" */ "./CardAccount"));
const Addresses = React.lazy(() => import(/* webpackChunkName: "Addresses" */ "./Addresses"));

const Details: FC = () => {
  const { t } = useTranslation();
  const { data: userData } = useQuery(GET_USER, {});
  const [getDetails, { data, loading }] = useLazyQuery(DETAILS, { fetchPolicy: "network-only" });

  useEffect(() => getDetails(), []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Suspense fallback={<div></div>}>
      <Wrapper>
        <DesktopAndTablet>
          <h3>{t("account.title")}</h3>
        </DesktopAndTablet>

        <GridDatos>
          <CardAccount {...{ userData, userDetails: { getDetails, details: data?.details, loading } }} />
          <Addresses {...{ userData, userDetails: { getDetails, details: data?.details, loading } }} />
        </GridDatos>
      </Wrapper>
    </Suspense>
  );
};

export default Details;
