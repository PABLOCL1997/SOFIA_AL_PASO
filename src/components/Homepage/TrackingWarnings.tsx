import React, { FC, useState } from "react";
import styled from "styled-components";
import { useQuery, useLazyQuery, useApolloClient } from "react-apollo";
import { GET_TRACKING_INFO } from "../../graphql/orders/queries";
import { DETAILS } from "../../graphql/user/queries";
import { ORDERS } from "../../graphql/user/queries";
import { BREAKPOINT } from "../../utils/constants";

import dayjs from "dayjs";
const advancedFormat = require("dayjs/plugin/advancedFormat");
dayjs.extend(advancedFormat);

const TrackingButton = styled.div`
  background-color: var(--red);
  padding: 10px;
  border-radius: 30px;
  color: white;
  font-family: MullerMedium;
  text-align: center;
  cursor: pointer;
`;

const WarningsWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 119px;
  max-width: 1170px;
  margin: 0 auto 30px;
  padding: 0 20px;
`;

const WarningElem = styled.div`
  width: 100%;
  background-color: rgb(149, 149, 149);
  padding: 20px;
  color: white;
  border-radius: 30px;
  font-family: MullerMedium;
  font-size: 24px;
  display: grid;
  grid-template-columns: 3fr 1fr;
  align-items: center;
  row-gap: 20px;

  > div:first-child {
    text-align: left;
  }

  @media screen and (max-width: ${BREAKPOINT}) {
    grid-template-columns: 1fr;
    font-size: 20px;

    div:nth-child(2n) {
      margin-bottom: 30px;
    }
  }
`;

const WarningElemBold = styled.span`
  font-family: MullerBold;
`;

type Warning = {
  status: string;
  orderId: string;
  nit: string;
  projectedArrival: string;
};

const TrackingWarnings: FC = () => {
  const client = useApolloClient();
  const [warningsList, setWarningsList] = useState<Array<Warning>>([]);
  const { data: localUserData } = useQuery<any>(DETAILS, {
    onCompleted: () => getWarningsList(),
  });

  const [getWarningsList] = useLazyQuery(ORDERS, {
    fetchPolicy: "no-cache",
    variables: {
      nit: localUserData?.details.nit || "0",
      dateFrom: dayjs().subtract(7, "days").format("DD/MM/YYYY"),
      dateTo: dayjs().format("DD/MM/YYYY"),
    },
    onCompleted: async (d) => {
      let fData = d.orders;
      let results: Array<Warning> = [];

      for (let i = 0; i < fData.length; i++) {
        let trackOrder = await client.query({
          query: GET_TRACKING_INFO,
          variables: {
            orderId: fData[i].incrementId,
            nit: String(localUserData.details.nit),
            isB2C: true,
          },
        });
        trackOrder.data.getTrackingInfo.orderId = fData[i].incrementId;
        trackOrder.data.getTrackingInfo.nit = String(localUserData.details.nit);
        results.push({
          status: trackOrder.data.getTrackingInfo.status,
          orderId: fData[i].incrementId,
          nit: String(localUserData.details.nit),
          projectedArrival: fData[i].projectedArrival,
        });
      }

      results = results.filter((el) => el.status === "OK");

      setWarningsList(results);
    },
  });
  return warningsList?.length > 0 ? (
    <WarningsWrapper>
      <WarningElem>
        {warningsList.map((el: Warning) => {
          return (
            <>
              <div>
                Tu pedido <WarningElemBold>{el.orderId}</WarningElemBold> está en camino y será entregado a las <WarningElemBold>{el.projectedArrival}</WarningElemBold>
              </div>
              <div>
                <TrackingButton onClick={() => (window.location.href = `/segui-tu-pedido?orderId=${el.orderId}&userNit=${el.nit}`)}>Hacer Seguimiento</TrackingButton>
              </div>
            </>
          );
        })}
      </WarningElem>
    </WarningsWrapper>
  ) : (
    <></>
  );
};

export default TrackingWarnings;
