import React, { FC } from "react";
import { useHistory } from "react-router-dom";
import { customStyles, statusTracking } from "../../../utils/constants";
import { EstadoCircle, Estado as EstadoWrapper } from "./style";
import TrackingIcon from "../../../assets/images/trackingIcon.svg";
import DeliveredInfoIcon from "../../../assets/images/deliveredInfoIcon.svg";
import dayjs from "dayjs";
const es = require("dayjs/locale/es");
const utc = require("dayjs/plugin/utc"); // dependent on utc plugin
const timezone = require("dayjs/plugin/timezone");
dayjs.locale(es);
dayjs.extend(utc);
dayjs.extend(timezone);

type Props = {
  item: any;
  nit?: any;
  greenCondition?: string;
  isBill?: boolean;
};

const OrderStatus: FC<Props> = ({ item, greenCondition = "PEDIDO ENTREGADO", isBill = false, nit }) => {
  const history = useHistory();
  const onClickTrackingIcon = () => {
    history.push(`/segui-tu-pedido?orderId=${item.orden}&userNit=${nit}`);
  };

  if (!isBill) {
    return (
      <EstadoWrapper>
        <>
          <EstadoCircle color={item.estado === greenCondition ? customStyles.green : customStyles.orange}></EstadoCircle>
          <span>{item.estado}</span>
          {(item.estado === statusTracking.sent || item.estado === statusTracking.ontheway || item.estado === statusTracking.onthewayDelivery) && (
            <img src={TrackingIcon} alt="" onClick={onClickTrackingIcon} />
          )}
          {item.estado === statusTracking.delivered && <img src={DeliveredInfoIcon} onClick={onClickTrackingIcon} />}
        </>
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
