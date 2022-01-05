import React, { FC, useState } from "react";
import { useQuery } from "react-apollo";
import { useHistory } from "react-router-dom";
import { ORDER_STATUS } from "../../../graphql/user/queries";
import { customStyles } from "../../../utils/constants";
import { EstadoCircle, Estado as EstadoWrapper } from "./style";
import TrackingIcon from "../../../assets/images/trackingIcon.svg";

type Props = {
  item: any;
  nit?: any;
  greenCondition?: string;
  isBill?: boolean;
};

const OrderStatus: FC<Props> = ({ item, greenCondition = "PEDIDO ENTREGADO", isBill = false, nit }) => {
  const history = useHistory();
  const { loading: statusLoading, data: statusData } = useQuery(ORDER_STATUS, {
    fetchPolicy: "network-only",
    variables: {
      incremendId: item.orden,
    },
    skip: isBill,
  });

  const onClickTrackingIcon = () => {
    history.push(`/segui-tu-pedido?orderId=${item.orden}&userNit=${nit}`);
  };

  if (!isBill) {
    return (
      <EstadoWrapper>
        {statusLoading && <>Cargando</>}
        {!statusLoading && statusData?.sofiawsOrderStatus?.status && (
          <>
            <EstadoCircle color={statusData.sofiawsOrderStatus.status === "PEDIDO ENTREGADO" ? customStyles.green : customStyles.orange}></EstadoCircle>
            <span>{statusData.sofiawsOrderStatus.status}</span>
            {(statusData.sofiawsOrderStatus.status === "PEDIDO ENVIADO" ||
              statusData.sofiawsOrderStatus.status === "PEDIDO EN CAMINO" ||
              statusData.sofiawsOrderStatus.status === "PEDIDO EN CAMINO RE-ENTREGA") && <img src={TrackingIcon} alt="" onClick={onClickTrackingIcon} />}
          </>
        )}
      </EstadoWrapper>
    );
  } else {
    return (
      <EstadoWrapper>
        <EstadoCircle color={item.estado === greenCondition ? customStyles.green : customStyles.orange}></EstadoCircle>
        <span>{item.estado}</span>
      </EstadoWrapper>
    );
  }
};

export default OrderStatus;
