import React, { FC, useState } from "react";
import { useQuery } from "react-apollo";
import { ORDER_STATUS } from "../../graphql/user/queries";

type Props = {
  incremendId: string;
};

const Status: FC<Props> = ({ incremendId }) => {
  const [status, setStatus] = useState<string>("");
  const { loading, data } = useQuery(ORDER_STATUS, {
    fetchPolicy: "cache-and-network",
    variables: {
      incremendId,
    },
    onCompleted: (data) => {
      setStatus(data.sofiawsOrderStatus.status || "RECIBIMOS TU PEDIDO");
    },
  });
  return (
    <span>
      {loading && <>Cargando</>}
      {!loading && data && <span className={status.toLowerCase().replace(/ /g, "-")}>{status}</span>}
    </span>
  );
};

export default Status;
