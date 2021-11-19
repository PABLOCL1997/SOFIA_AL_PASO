import gql from "graphql-tag";

export const GET_TRACKING_INFO = gql`
  query getTrackingInfo($orderId: String, $nit: String, $isB2C: Boolean) {
    getTrackingInfo(orderId: $orderId, nit: $nit, isB2C: $isB2C) {
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
