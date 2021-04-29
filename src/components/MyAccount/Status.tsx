import React, { FC } from "react";
import { useQuery } from "react-apollo";
import { ORDER_STATUS } from "../../graphql/user/queries";


type Props = {
  incremendId: string;
}

const Status: FC<Props> = ({ incremendId }) => {
  const { loading, data } = useQuery(ORDER_STATUS, {
    fetchPolicy: "cache-first",
    variables:{
      incremendId
    }
  })
  return (
    <span>
      {loading && (
        <>
          Cargando
        </>
      )}
      {!loading && data && (
        <span
            className={data.sofiawsOrderStatus.status.toLowerCase().replace(/ /g, "-")}
        >{data.sofiawsOrderStatus.status}</span>
      )}

    </span>
  )
}

export default Status