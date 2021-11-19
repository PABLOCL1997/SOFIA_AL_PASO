import React, { FC, useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/react-hooks";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { BREAKPOINT, LG } from "../utils/constants";
import DelayedWrapper from "../components/DelayedWrapper";
import { useTranslation } from "react-i18next";
import { GET_TRACKING_INFO } from "../graphql/orders/queries";
import GoogleMapReact from "google-map-react";
import MapMarker from "../components/Tracking/MapMarker";
import CalendarIcon from "../assets/images/calendar.svg";
import ClockIcon from "../assets/images/clock.svg";
import MarkerIcon from "../assets/images/marker.svg";
import TruckMarkerIcon from "../assets/images/truckMarker.png";
import dayjs from "dayjs";
const es = require("dayjs/locale/es");
const utc = require("dayjs/plugin/utc"); // dependent on utc plugin
const timezone = require("dayjs/plugin/timezone");
dayjs.locale(es);
dayjs.extend(utc);
dayjs.extend(timezone);

const Cta = React.lazy(() => import(/* webpackChunkName: "Cta" */ "../components/Cta"));

const Header = styled.div`
  position: relative;
  padding: 54px 0;
  text-align: center;

  h1 {
    font-family: MullerMedium;
    font-size: 40px;
    line-height: 1.5em;
    color: var(--black);
  }

  h2 {
    font-family: MullerMedium;
    font-size: 20px;
    color: var(--black);
    text-align: center;
    margin: 20px auto;
  }

  @media screen and (max-width: ${BREAKPOINT}) {
    padding: 150px 40px 20px 40px;
  }
`;

const CtaWrapper = styled.div`
  width: 100%;
  margin: 70px auto;

  &.modalCtaWrapper {
    margin: 10px auto;
  }

  button {
    width: 70%;
    padding: 15px 30px;
    text-transform: uppercase;
  }
`;

const Content = styled.div`
  position: relative;
  margin: 0 auto;
  background: transparent;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30%;
  margin-top: 50px;

  &.extend {
    width: 70%;

    @media (max-width: ${LG}) {
      margin-top: 140px;
    }

    h2 {
      font-family: MullerMedium;
      font-size: 20px;
      color: var(--black);
      text-align: left;
      margin: 20px 0px;
      width: 100%;
    }
  }

  input {
    background: var(--f-gray);
    border-radius: 44px;
    width: calc(100% - 60px);
    border: 1px solid transparent;
    padding: 15px 30px;
    font-family: MullerMedium;
    font-size: 14px;
    line-height: 14px;
    letter-spacing: 0.01em;
    color: var(--black);
    &::placeholder {
      color: var(--font);
    }

    &.error {
      border: 1px solid var(--red) !important;
    }

    &:focus {
      border: 1px solid var(--black);
    }
  }

  p {
    width: 100%;

    &.disclaimer {
      text-align: left;
      margin: 30px auto;

      svg {
        display: block;
        float: left;
        margin-right: 10px;
        height: 30px;
      }
    }

    &.startSession {
      text-align: center;
      margin: 0px auto 80px;
    }
  }

  @media (max-width: ${LG}) {
    width: 80%;
  }
`;

const Link = styled.span`
  font-size: 18px;
  letter-spacing: 0.01em;
  text-decoration-line: underline;
  color: var(--red);
  cursor: pointer;
  display: block;
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
  &:hover {
    opacity: 0.8;
  }
`;

const Maps = styled.div`
  width: 100%;
  height: 300px;
  border-radius: 40px;
  margin-bottom: 40px;

  .gmnoprint {
    display: none;
  }

  > div > div {
    border-radius: 14px;
  }

  @media (max-width: ${LG}) {
    height: 256px;
    margin: 20px 0;
  }
`;

const DeliveryData = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  grid-column-gap: 120px;
  margin-bottom: 80px;

  @media (max-width: ${BREAKPOINT}) {
    grid-template-columns: 1fr;
  }
`;

const DeliveryDataMainInfo = styled.div`
  padding: 20px;
  border-radius: 20px;
  border: 1px solid white;
  box-shadow: 0 0 10px #ddd;
  display: grid;

  @media (max-width: ${BREAKPOINT}) {
    margin-bottom: 20px;
  }
`;

const DeliveryDataMainInfoRow = styled.div`
  padding: 20px;

  > div {
    height: 32px;
    > img {
      vertical-align: middle;
      margin-right: 10px;
      width: 22px;
    }
    > span {
      vertical-align: middle;
    }

    &:nth-child(2) {
      font-weight: 800;
    }
  }
`;

const DeliveryDataSecondaryInfoRow = styled.div`
  padding: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #cbcbcb;
  display: flex;
  justify-content: space-between;
  padding-bottom: 30px;

  &:last-child {
    border-bottom: none;
    font-weight: 800;
  }
`;

const LoaderWrapper = styled.div`
  position: absolute;
  background: white;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  border-radius: 20px;
  img {
    width: 50px;
  }
`;

const ModalCourtain = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  z-index: 4;
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  &.visible {
    display: flex;
  }
`;

const Modal = styled.div`
  position: relative;
  padding: 42px;
  background: white;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 350px;
`;

const Title = styled.h2`
  font-family: MullerMedium;
  font-size: 24px;
  line-height: 24px;
  color: var(--black);
  margin: 20px 0;
`;

const Text = styled.p`
  font-size: 14px;
  line-height: 142%;
  text-align: center;
  letter-spacing: 0.02em;
  color: var(--black);
  max-width: 400px;
  margin-bottom: 30px;

  > strong {
    font-weight: 600;
  }
`;

type CenterType = {
  lat: number;
  lng: number;
};

type mapPropertiesType = {
  center: CenterType;
  zoom: number;
};

type TrackingInfoType = {
  destinationAddress: string;
  destinationLat: number;
  destinationLng: number;
  equipmentId: string;
  mapProperties: mapPropertiesType;
  projectedArrivalDate: string;
  projectedArrivalTime: string;
  quantityProducts: string;
  orderDate: string;
  total: string;
};

type PlaceType = {
  lat: number;
  lng: number;
};

const Tracking: FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [loader, setLoader] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [showMap, setShowMap] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfoType | null>(null);
  const [nit, setNit] = useState("");
  const [trackingInfoInterval, setTrackingInfoInterval] = useState<number | null>(null);
  const [places, setPlaces] = useState<Array<PlaceType>>([]);

  const [getTrackingInfo] = useLazyQuery(GET_TRACKING_INFO, {
    fetchPolicy: "network-only",
    onCompleted: (d) => {
      setLoader(false);
      const res = d.getTrackingInfo;
      const { status, resMsg, destinationAddress, destinationLat, destinationLng, equipmentId, vehicleLat, vehicleLng, quantityProducts, fechaPedido, total } = res;
      const projectedArrival = dayjs(res.projectedArrival).tz("America/La_Paz");

      if (res.status === "OK") {
        setTrackingInfo({
          destinationAddress,
          destinationLat,
          destinationLng,
          equipmentId,
          mapProperties: {
            center: {
              lat: vehicleLat,
              lng: vehicleLng,
            },
            zoom: 13,
          },
          projectedArrivalDate: projectedArrival.format("DD/MM/YYYY"),
          projectedArrivalTime: projectedArrival.format("HH:mm"),
          quantityProducts,
          orderDate: dayjs(fechaPedido).format("DD/MM/YYYY"),
          total,
        });
        setPlaces([
          {
            lng: vehicleLng,
            lat: vehicleLat,
          },
          {
            lng: destinationLng,
            lat: destinationLat,
          },
        ]);
        setShowMap(true);
        setShowModal(false);
      } else {
        if (trackingInfoInterval) {
          clearInterval(trackingInfoInterval);
          setTrackingInfoInterval(null);
        }
        setShowModal(true);
        if (status === "RECIBIMOS TU PEDIDO" || status === "ALISTANDO TU PEDIDO") {
          setModalTitle("Pedido en proceso");
          setModalMessage(resMsg);
        } else if (status === "PEDIDO ENTREGADO") {
          setModalTitle("Pedido entregado");
          const actualArrival = dayjs(resMsg).tz("America/La_Paz");
          setModalMessage(
            `Tu pedido fue entregado el día <strong>${actualArrival.format("DD/MM/YYYY")}</strong> a las <strong>${actualArrival.format(
              "HH:mm"
            )} hs.</strong> en <strong>${destinationAddress}</strong>`
          );
        } else if (status === "PEDIDO NO ENTREGADO") {
          setModalTitle("Pedido no entegado");
          setModalMessage(resMsg);
        } else if (status === "PEDIDO CANCELADO") {
          setModalTitle("Pedido cancelado");
          setModalMessage(resMsg);
        } else {
          setModalTitle("Error");
          setModalMessage(resMsg);
        }
      }
    },
  });

  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const orderId = params.get("orderId");
    const userNit = params.get("userNit");

    if (orderId && userNit) {
      setLoader(true);
      setTrackingNumber(orderId);
      const interval = window.setInterval(() => {
        getTrackingInfo({
          variables: {
            orderId,
            nit: userNit,
            isB2C: true,
          },
        });
      }, 120000);
      setTrackingInfoInterval(interval);
      getTrackingInfo({
        variables: {
          orderId,
          nit: userNit,
          isB2C: true,
        },
      });
    }
  }, []);

  const getMapBounds = (map: any, maps: any, places: any) => {
    const bounds = new maps.LatLngBounds();

    places.forEach((place: PlaceType) => {
      bounds.extend(new maps.LatLng(place.lat, place.lng));
    });
    return bounds;
  };

  // Re-center map when resizing the window
  const bindResizeListener = (map: any, maps: any, bounds: any) => {
    maps.event.addDomListenerOnce(map, "idle", () => {
      maps.event.addDomListener(window, "resize", () => {
        map.fitBounds(bounds);
      });
    });
  };

  // Fit map to its bounds after the api is loaded
  const apiIsLoaded = (map: any, maps: any, places: Array<PlaceType>) => {
    // Get bounds by our places
    const bounds = getMapBounds(map, maps, places);
    // Fit map to bounds
    map.fitBounds(bounds);
    // Bind the resize listener
    bindResizeListener(map, maps, bounds);
  };

  return (
    <DelayedWrapper>
      {loader ? (
        <LoaderWrapper>
          <img src="/images/loader.svg" alt="loader" />
        </LoaderWrapper>
      ) : (
        <>
          {!showMap && (
            <Header>
              <svg width="31" height="26" viewBox="0 0 31 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.3334 2H2V17.889H20.3334V2Z" stroke="#E30613" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M20.3335 8.1113H25.2224L28.8891 11.778V17.8891H20.3335V8.1113Z" stroke="#E30613" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                <path
                  d="M7.50003 24C9.18757 24 10.5556 22.6319 10.5556 20.9444C10.5556 19.2568 9.18757 17.8888 7.50003 17.8888C5.81248 17.8888 4.44446 19.2568 4.44446 20.9444C4.44446 22.6319 5.81248 24 7.50003 24Z"
                  stroke="#E30613"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M23.3891 24C25.0766 24 26.4446 22.6319 26.4446 20.9444C26.4446 19.2568 25.0766 17.8888 23.3891 17.8888C21.7015 17.8888 20.3335 19.2568 20.3335 20.9444C20.3335 22.6319 21.7015 24 23.3891 24Z"
                  stroke="#E30613"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <h1>{t("tracking.followOrder")}</h1>
              <h2>{t("tracking.instructions")}</h2>
            </Header>
          )}
          {!showMap && (
            <Content>
              <input name={"tracking_number"} onChange={(evt) => setTrackingNumber(evt.target.value)} type={"text"} placeholder={"Número de pedido"} />
              <p className="disclaimer">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M8 16C3.6 16 0 12.4 0 8C0 3.6 3.6 0 8 0C12.4 0 16 3.6 16 8C16 12.4 12.4 16 8 16ZM8 2C4.7 2 2 4.7 2 8C2 11.3 4.7 14 8 14C11.3 14 14 11.3 14 8C14 4.7 11.3 2 8 2Z"
                    fill="#2F2F2F"
                  />
                  <path d="M9 12H7V7H9V12Z" fill="#2F2F2F" />
                  <path d="M8 4C8.55228 4 9 4.44772 9 5C9 5.55228 8.55228 6 8 6C7.44772 6 7 5.55228 7 5C7 4.44772 7.44772 4 8 4Z" fill="#2F2F2F" />
                </svg>
                {t("tracking.warning")}
              </p>
              <input name={"nit"} onChange={(evt) => setNit(evt.target.value)} type={"nit"} placeholder={"Código de cliente (NIT/CI)"} />
              <CtaWrapper>
                <Cta
                  filled={true}
                  action={() => {
                    window.location.href = `/segui-tu-pedido?orderId=${trackingNumber}&userNit=${nit}`;
                    setLoader(true);
                  }}
                  text={"Consultar"}
                />
              </CtaWrapper>
              <Link onClick={() => history.push("/")}>{t("tracking.startSession1")}</Link>
              <p className="startSession">{t("tracking.startSession2")}</p>
            </Content>
          )}
          {showMap && trackingInfo && (
            <Content className="extend">
              <Maps>
                <GoogleMapReact
                  onGoogleApiLoaded={({ map, maps }) => apiIsLoaded(map, maps, places)}
                  bootstrapURLKeys={{
                    key: "AIzaSyD-ytvHpafjsy_r9WbqGTj09_wkYuQAjSk",
                  }}
                  defaultZoom={trackingInfo.mapProperties.zoom}
                  defaultCenter={trackingInfo.mapProperties.center}
                  options={{
                    zoomControlOptions: { position: 10 },
                    zoomControl: true,
                    scrollwheel: true,
                    streetViewControl: false,
                    fullscreenControl: false,
                  }}
                >
                  <MapMarker lat={trackingInfo.mapProperties.center.lat} lng={trackingInfo.mapProperties.center.lng} icon={TruckMarkerIcon} />
                  <MapMarker lat={trackingInfo.destinationLat} lng={trackingInfo.destinationLng} icon={MarkerIcon} isPin />
                </GoogleMapReact>
              </Maps>
              <h2>{t("tracking.deliverData.title")}</h2>
              <DeliveryData>
                <DeliveryDataMainInfo>
                  <DeliveryDataMainInfoRow>
                    <div>
                      <img src={CalendarIcon} alt="Fecha" />
                      <span>{t("tracking.deliverData.date")}</span>
                    </div>
                    <div>{trackingInfo.projectedArrivalDate}</div>
                  </DeliveryDataMainInfoRow>
                  <DeliveryDataMainInfoRow>
                    <div>
                      <img src={ClockIcon} alt="Horario" />
                      <span>{t("tracking.deliverData.estimatedTime")}</span>
                    </div>
                    <div>{trackingInfo.projectedArrivalTime}</div>
                  </DeliveryDataMainInfoRow>
                  <DeliveryDataMainInfoRow>
                    <div>
                      <img src={MarkerIcon} alt="Dirección" />
                      <span>{t("tracking.deliverData.address")}</span>
                    </div>
                    <div>{trackingInfo.destinationAddress}</div>
                  </DeliveryDataMainInfoRow>
                </DeliveryDataMainInfo>
                <div>
                  <DeliveryDataSecondaryInfoRow>
                    <span>{t("tracking.orderNumberTitle")}</span>
                    <span>{trackingNumber}</span>
                  </DeliveryDataSecondaryInfoRow>
                  <DeliveryDataSecondaryInfoRow>
                    <span>{t("tracking.deliverData.orderDate")}</span>
                    <span>{trackingInfo.orderDate}</span>
                  </DeliveryDataSecondaryInfoRow>
                  <DeliveryDataSecondaryInfoRow>
                    <span>{t("tracking.deliverData.qty")}</span>
                    <span>
                      {trackingInfo.quantityProducts} {t("tracking.deliverData.products")}
                    </span>
                  </DeliveryDataSecondaryInfoRow>
                  <DeliveryDataSecondaryInfoRow>
                    <span>{t("tracking.deliverData.total")}</span>
                    <span>Bs. {trackingInfo.total}</span>
                  </DeliveryDataSecondaryInfoRow>
                </div>
              </DeliveryData>
            </Content>
          )}
          <ModalCourtain className={showModal ? "visible" : ""}>
            {showModal && (
              <Modal>
                <Title>{modalTitle}</Title>
                <Text dangerouslySetInnerHTML={{ __html: modalMessage }}></Text>
                <CtaWrapper className={"modalCtaWrapper"}>
                  <Cta
                    filled={true}
                    text={"Ir a inicio"}
                    action={() => {
                      if (trackingInfoInterval) {
                        clearInterval(trackingInfoInterval);
                        setTrackingInfoInterval(null);
                      }
                      setShowModal(false);
                      history.push("/segui-tu-pedido");
                    }}
                  />
                </CtaWrapper>
              </Modal>
            )}
          </ModalCourtain>
        </>
      )}
    </DelayedWrapper>
  );
};

export default Tracking;
