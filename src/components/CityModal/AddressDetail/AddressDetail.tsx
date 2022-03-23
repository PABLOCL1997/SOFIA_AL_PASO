import React, { FC, useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import Marker, { Maps } from "../../MapMarker";
import { cities, findCity, findKeyByCity, KeyValue } from "../../../utils/string";
import StarIcon from "../../../assets/images/star.svg";

import useCityPriceList from "../../../hooks/useCityPriceList";
import { Changes, ShippingMethod, Steps } from "../types";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import { DETAILS, GET_USER } from "../../../graphql/user/queries";
import { SET_USER } from "../../../graphql/user/mutations";
import Agency from "../../../types/Agency";
import { AddressType, UserType } from "../../../graphql/user/type";
import { StarWrap, TooltipStar } from "../styles";
import { useTranslation } from "react-i18next";

import { OrderType } from "../../../types/Order";
import Map, { Circle } from "../../Map";
import { setLatLng, findNearestPointFromArray } from "../../../utils/googlemaps";

import PickupIcon from "../../../assets/images/ChooseShipping/pickup-icon";
import DeliveryIcon from "../../../assets/images/ChooseShipping/delivery-icon";
import ExpressIcon from "../../../assets/images/ChooseShipping/express-icon";

import * as SC from "./style";
import useUser from "../../../hooks/useUser";

interface Props {
  setStep: Function;
  setShippingMethod: Function;
  shippingMethod: ShippingMethod;
  setChangeModalVisible: Function;
  setModalStepType: Function;
  setNewAddressText: Function;
}

type User = {
  cityKey?: string;
  cityName?: string;
  openCityModal?: boolean;
  defaultAddressId?: number;
  defaultAddressLabel?: string;
  employee?: string;
  idPriceList?: number;
  agency?: string | null;
};

interface Point {
  lat: number;
  lng: number;
  name?: string;
  street?: string;
}

const AddressDetail: FC<Props> = ({ setStep, setShippingMethod, shippingMethod, setChangeModalVisible, setModalStepType, setNewAddressText }) => {
  const { t } = useTranslation();
  const { hideExpressModal } = useUser();
  const { data } = useQuery(GET_USER, {});
  const { agency, setAgency, agencies, express, city: cityHook, hasB2EAddress } = useCityPriceList();
  const [withMap, setWithMap] = useState<boolean>(true);
  const [city, setCity] = useState<User>({});
  const [agencyKey, setagencyKey] = useState<string>("");
  const [setUser] = useMutation(SET_USER, { variables: { user: city } });
  const [setUserMinimumPrice] = useMutation(SET_USER, {});
  const [setStore] = useMutation(SET_USER, { variables: { user: { store: "ECOMMERCE" } } });
  const [isSelectingGeo, setIsSelectingGeo] = useState<boolean>(true);

  const [selectedAddress, setSelectedAddress] = useState<AddressType | Agency | any>();
  const [centerMap, setCenterMap] = useState<Point>({
    lat: parseFloat("-17.80904437441624"),
    lng: parseFloat("-63.20539010110378"),
  } as Point);
  const [inputs, setInputs] = useState<UserType>({ addresses: [] });
  const [userId, setUserId] = useState(0);
  const [circleRadius, setCircleRadius] = useState(0);

  const [getDetails] = useLazyQuery(DETAILS, {
    fetchPolicy: "network-only",
    onCompleted: (d) => {
      setUserId(d.details.id);
      setInputs(d.details);
    },
  });

  const changeCity = (c: KeyValue) => {
    setCity({
      cityKey: c.key,
      cityName: c.value,
      defaultAddressLabel: c.value,
      defaultAddressId: undefined,
      openCityModal: false,
      idPriceList: 0,
      agency: null,
    });
  };

  const handleSetCity = async (isAddress: boolean) => {
    const store: OrderType = selectedAddress?.id_price_list > 0 ? "B2E" : "ECOMMERCE";
    setStore({ variables: { user: { store } } });

    if (agency) {
      setModalStepType(Changes.PickupToDelivery);
    } else {
      setModalStepType(Changes.DeliveryToDelivery);
    }

    if (isAddress) {
      // selects an address
      if (selectedAddress) {
        await setUser({
          variables: {
            user: {
              defaultAddressId: selectedAddress?.id,
              defaultAddressLabel: selectedAddress?.street,
              openCityModal: false,
              cityKey: findKeyByCity(selectedAddress?.city) || "SC",
              cityName: selectedAddress?.city,
              agency: null,
              idPriceList: selectedAddress?.id_price_list || 0,
            },
          },
        });
        setNewAddressText(selectedAddress?.street);
      }
    } else {
      // selects a city
      if (city && city.cityKey) {
        await setUser({
          variables: {
            user: {
              cityKey: city.cityKey,
              cityName: findCity(city.cityKey),
              defaultAddressLabel: findCity(city.cityKey),
              defaultAddressId: undefined,
              openCityModal: false,
              agency: null,
              idPriceList: selectedAddress?.id_price_list || 0,
            },
          },
        });
        setNewAddressText(findCity(city.cityKey));
      }
    }

    setChangeModalVisible(true);
    setStep(Steps.Choosing);
  };

  const handleSetAgency = async () => {
    const store: OrderType = "PICKUP";
    setStore({ variables: { user: { store } } });

    // TODO determine if store to store or another
    if (agency) {
      setModalStepType(Changes.PickupToPickup);
    } else {
      setModalStepType(Changes.DeliveryToPickup);
    }

    await setUser({
      variables: {
        user: {
          defaultAddressId: selectedAddress?.id,
          defaultAddressLabel: selectedAddress?.name,
          openCityModal: false,
          cityKey: findKeyByCity(selectedAddress?.city),
          cityName: selectedAddress?.city,
          agency: selectedAddress?.key,
          idPriceList: 0,
        },
      },
    });

    setChangeModalVisible(true);
    setNewAddressText(selectedAddress?.name);
    setStep(Steps.Choosing);
    setUserMinimumPrice({
      variables: { user: { showMinimumPrice: String("show") } },
    });
  };

  const handleSetExpress = async () => {
    const store: OrderType = "EXPRESS";
    setStore({ variables: { user: { store } } });

    const lat = isSelectingGeo ? (window as any).latitude : selectedAddress?.latitude;
    const lng = isSelectingGeo ? (window as any).longitude : selectedAddress?.longitude;

    const nearestAgency: any = findNearestPointFromArray(
      { lat, lng },
      express.map((a: Agency) => ({ ...a, lat: a.latitude, lng: a.longitude }))
    ) as Point;
    if (nearestAgency?.key) {
      const defaultAddressId = isSelectingGeo ? 0 : selectedAddress?.id;
      const defaultAddressLabel = isSelectingGeo ? (window as any).infowindow.content : selectedAddress?.street;
      const cityKey = isSelectingGeo ? nearestAgency.abbr : findKeyByCity(selectedAddress?.city);
      const cityName = isSelectingGeo ? nearestAgency.city : selectedAddress?.city;

      setAgency(nearestAgency.key);
      await setUser({
        variables: {
          user: {
            defaultAddressId,
            defaultAddressLabel,
            openCityModal: false,
            cityKey,
            cityName,
            agency: nearestAgency.key,
            idPriceList: 0,
          },
        },
      });
      setStep(Steps.Choosing);
      hideExpressModal();  
    }
  };

  const handleAddressGeo = async ({ lat, lng }: Point) => {
    try {
      setLatLng("", lat, lng);

      const nearestAgency: any = findNearestPointFromArray(
        { lat, lng },
        express.map((a: Agency) => ({ ...a, lat: a.latitude, lng: a.longitude }))
      ) as Point;
      if (nearestAgency?.key) {
        setAgency(nearestAgency.key);
      }
    } catch (error) {
      console.log("no se pudo establecer la ubicacion", error);
    }
  };

  useEffect(() => {
    if (data.userInfo.length && data.userInfo[0].cityKey) {
      setCity(data.userInfo[0].cityKey);
    }
  }, [data]);

  useEffect(() => {
    if (shippingMethod === ShippingMethod.Delivery && inputs.addresses && !!inputs.addresses.length) {
      setSelectedAddress(inputs.addresses[0]);
    }
  }, [inputs]);

  useEffect(() => {
    const userInfo = data && data.userInfo.length ? data.userInfo[0] : {};
    if (userId !== (userInfo.id ? userInfo.id : 0)) {
      if ((userInfo.id ? userInfo.id : 0) > 0) {
        getDetails();
      } else {
        setUserId(0);
        setInputs({ addresses: [] });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (agency) {
      setagencyKey(agency);
    }
  }, [agency]);

  useEffect(() => {
    setCity({
      ...city,
      cityKey: cityHook,
    });
  }, [cityHook]);

  return (
    <>
      <SC.Wrapper withMap={withMap}>
        {shippingMethod === ShippingMethod.Express && (
          <SC.Selector withMap={withMap}>
            <ExpressIcon />
            <SC.Title>Envío Express</SC.Title>
            <SC.Subtitle withMap={withMap}>Recibe en casa</SC.Subtitle>
            <SC.Addresses withMap={withMap}>
              <SC.RadionGroup selected={isSelectingGeo} onClick={() => setIsSelectingGeo(true)}>
                <input type="radio" name="manual_geo" id="" checked={isSelectingGeo} />
                <label htmlFor="manual_geo">Colocar mi ubicación en el mapa</label>
              </SC.RadionGroup>
              {inputs.addresses &&
                React.Children.toArray(
                  inputs.addresses
                    .filter((address: AddressType) => (hasB2EAddress ? address.id_price_list : address))
                    .map((address: AddressType) => (
                      <SC.RadionGroup
                        selected={!isSelectingGeo && selectedAddress?.id === address.id}
                        onClick={() => {
                          setShippingMethod(ShippingMethod.Express);
                          setIsSelectingGeo(false);
                          setSelectedAddress({ ...address });
                          handleAddressGeo({
                            lat: parseFloat(address?.latitude || "0"),
                            lng: parseFloat(address?.longitude || "0"),
                          } as Point);
                        }}
                      >
                        <input readOnly id={`city${address.id}`} name="city" type="radio" checked={!isSelectingGeo && !!(selectedAddress?.id === address.id)} />
                        <label>
                          {address?.street?.replace(/ \| /g, " ")}
                          {address?.id_price_list ? (
                            <StarWrap>
                              <img src={StarIcon} alt="" />
                              <TooltipStar>{t("account.tooltip_star_msg")}</TooltipStar>
                            </StarWrap>
                          ) : null}
                        </label>
                      </SC.RadionGroup>
                    ))
                )}
            </SC.Addresses>
            <button onClick={() => handleSetExpress()}>Confirmar</button>
          </SC.Selector>
        )}

        {shippingMethod === ShippingMethod.Pickup && (
          <SC.Selector withMap={withMap}>
            <PickupIcon />
            <SC.Title>Retira al paso</SC.Title>
            <SC.Subtitle withMap={withMap}>Elige tu tienda más cercana</SC.Subtitle>
            <SC.Addresses withMap={withMap}>
              {agencies?.length &&
                agencies.map((_agency: Agency, index: number) => (
                  <SC.RadionGroup
                    key={`${_agency.key}#${index}`}
                    className={agencyKey === _agency.key || _agency.key === selectedAddress?.key ? "selected" : ``}
                    selected={false}
                    onClick={() => {
                      setShippingMethod(ShippingMethod.Pickup);
                      setSelectedAddress({ ..._agency, isAgency: true });
                      setagencyKey(_agency.key);
                      setCenterMap({
                        lat: parseFloat(_agency.latitude),
                        lng: parseFloat(_agency.longitude),
                      } as Point);
                    }}
                  >
                    <input readOnly name="agency" checked={agencyKey === _agency.key || _agency.key === selectedAddress?.key} type="radio" />
                    <label>{_agency.name}</label>
                  </SC.RadionGroup>
                ))}
            </SC.Addresses>
            {withMap ? <a onClick={() => setWithMap(false)}>Cerrar el mapa</a> : <a onClick={() => setWithMap(true)}>Ver en mapa</a>}

            <button onClick={handleSetAgency}>Confirmar</button>
          </SC.Selector>
        )}

        {shippingMethod === ShippingMethod.Delivery && (
          <SC.Selector withMap={withMap}>
            <DeliveryIcon />
            <SC.Title>Envío a domicilio</SC.Title>
            <SC.Subtitle withMap={withMap}>Selecciona una de tus direcciones guardadas o agrega una nueva:</SC.Subtitle>
            <SC.Addresses withMap={withMap}>
              {/* when no addresses */}
              {inputs.addresses && !inputs.addresses.length ? (
                <>
                  {cities.map((c: KeyValue) => (
                    <SC.RadionGroup
                      selected={true}
                      key={c.key}
                      onClick={() => {
                        changeCity(c);
                        setSelectedAddress({ street: c.value });
                      }}
                    >
                      <input readOnly id={`city${c.key}`} name="city" type="radio" checked={city && city.cityKey === c.key} />
                      <label>{c.value}</label>
                    </SC.RadionGroup>
                  ))}
                </>
              ) : (
                // when addresses
                <>
                  {inputs.addresses &&
                    React.Children.toArray(
                      inputs.addresses
                        .filter((address: AddressType) => (hasB2EAddress ? address.id_price_list : address))
                        .map((address: AddressType) => (
                          <SC.RadionGroup
                            selected={selectedAddress?.id === address.id}
                            onClick={() => {
                              setShippingMethod(ShippingMethod.Delivery);
                              setSelectedAddress({ ...address });
                              setCenterMap({
                                lat: parseFloat(address?.latitude || "0"),
                                lng: parseFloat(address?.longitude || "0"),
                              } as Point);
                            }}
                          >
                            <input readOnly id={`city${address.id}`} name="city" type="radio" checked={!!(selectedAddress?.id === address.id)} />
                            <label>
                              {address?.street?.replace(/ \| /g, " ")}
                              {address?.id_price_list ? (
                                <StarWrap>
                                  <img src={StarIcon} alt="" />
                                  <TooltipStar>{t("account.tooltip_star_msg")}</TooltipStar>
                                </StarWrap>
                              ) : null}
                            </label>
                          </SC.RadionGroup>
                        ))
                    )}
                </>
              )}
            </SC.Addresses>
            {withMap ? <a onClick={() => setWithMap(false)}>Cerrar el mapa</a> : <a onClick={() => setWithMap(true)}>Ver en mapa</a>}

            <button onClick={() => handleSetCity(!(inputs.addresses && !inputs.addresses.length))}>Confirmar</button>
          </SC.Selector>
        )}

        {shippingMethod === ShippingMethod.Store && (
          <SC.Selector withMap={withMap}>
            <ExpressIcon />
            <SC.Title>Envío Express</SC.Title>
            <SC.Subtitle withMap={withMap}>Verifica tu sucursal mas cercana</SC.Subtitle>
            {withMap ? <a onClick={() => setWithMap(false)}>Cerrar el mapa</a> : <a onClick={() => setWithMap(true)}>Ver en mapa</a>}

            <button onClick={() => {}}>Confirmar</button>
          </SC.Selector>
        )}

        {withMap && (
          <Maps>
            {shippingMethod === ShippingMethod.Express && <Map />}
            {shippingMethod !== ShippingMethod.Express && (
              <GoogleMapReact
                bootstrapURLKeys={{
                  key: "AIzaSyDkzapVsE8dx0rclt3nQzew_JzZs4BOGw4",
                }}
                defaultZoom={15}
                defaultCenter={centerMap}
                center={centerMap}
                options={{
                  fullscreenControl: false,
                }}
                onGoogleApiLoaded={({ map, maps }) => {}}
              >
                {shippingMethod === ShippingMethod.Pickup &&
                  agencies?.length &&
                  React.Children.toArray(
                    agencies.map(({ name, street, latitude, longitude, key }: Agency) => (
                      <Marker lat={parseFloat(latitude)} lng={parseFloat(longitude)} text={street} name={name} maxWidth={"400px"} selected={!!(key === selectedAddress?.key || key === agency)} />
                    ))
                  )}
                {shippingMethod === ShippingMethod.Delivery &&
                  inputs.addresses &&
                  !!inputs.addresses.length &&
                  React.Children.toArray(
                    inputs.addresses.map((address: AddressType) => (
                      <Marker
                        lat={parseFloat(address.latitude || "0")}
                        lng={parseFloat(address.longitude || "0")}
                        text={address.street}
                        name={" "}
                        maxWidth={"400px"}
                        selected={!!(selectedAddress?.id === address.id)}
                      />
                    ))
                  )}

                {shippingMethod === ShippingMethod.Store &&
                  express.map(({ name, street, latitude, longitude }: Agency) => (
                    <PickupIcon lat={parseFloat(latitude)} lng={parseFloat(longitude)} text={street} name={name} maxWidth={"400px"} selected={true} />
                  ))}
              </GoogleMapReact>
            )}
          </Maps>
        )}
      </SC.Wrapper>
    </>
  );
};

export default AddressDetail;
