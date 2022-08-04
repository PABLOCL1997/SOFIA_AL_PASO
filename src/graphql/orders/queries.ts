import gql from "graphql-tag";

export const GET_TRACKING_INFO = gql`
  query getTrackingInfo($orderId: String, $nit: String, $isB2C: Boolean, $clientIp: String) {
    getTrackingInfo(orderId: $orderId, nit: $nit, isB2C: $isB2C, clientIp: $clientIp) {
      status
      resMsg
      equipmentId
      destinationAddress
      destinationLat
      destinationLng
      projectedArrival
      quantityProducts
      vehicleLat
      vehicleLng
      orderDate
      total
    }
  }
`;
