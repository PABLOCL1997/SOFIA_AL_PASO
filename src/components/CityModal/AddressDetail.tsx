import React, { FC, useState, useEffect } from "react";
import styled from "styled-components";
import GoogleMapReact from "google-map-react";
import Marker, { Maps } from "../MapMarker"
import { cities, findCity, findKeyByCity, KeyValue } from "../../utils/string";
import StarIcon from "../../assets/images/star.svg";

import useCityPriceList from "../../hooks/useCityPriceList";
import { Changes, ShippingMethod, Steps } from "./types";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import { DETAILS, GET_USER } from "../../graphql/user/queries";
import { SET_USER } from "../../graphql/user/mutations";
import Agency from "../../types/Agency";
import { AddressType, UserType } from "../../graphql/user/type";
import { StarWrap, TooltipStar } from "./styles";
import { useTranslation } from "react-i18next";

import { BREAKPOINT } from "../../utils/constants";
import useMinimumPrice from "../../hooks/useMinimumPrice";

const Wrapper = styled.div<{ withMap: boolean }>`
    ${({ withMap }) =>
        withMap ?
            `
            display: grid;
            grid-template-columns: 300px 500px;       
        ` :
            `
            display: flex;
            justify-content: center;
        `
    }

    @media screen and (max-width: ${BREAKPOINT}) {
        display: flex;
        width: 100%;
        flex-direction: column;
        justify-content: center;
    }
`

const Selector = styled.div<{ withMap: boolean }>`
    display: flex;
    flex-direction: column;
    

    ${({ withMap }) => withMap && `margin-right: 48px;`}
    
    ${({ withMap }) => withMap ?
        `
    align-items: flex-start;
    justify-content: flex-start;
    `
        :
        `
    align-items: center;
    justify-content: center;
    `
    }

    svg {
        margin-top: 30px;
        @media screen and (max-width: ${BREAKPOINT}) {
            margin-top: 15px;
            width: 30px;
        }
    }

    a {
        font-family: MullerMedium;

        width: 100%;
        ${({ withMap }) => withMap ?
        `
        margin: 24px 0 40px;
        `
        :
        `
        margin: 24px 0 40px;
        `
    }
        font-size: 12px;
        line-height: 16px;
        /* identical to box height, or 133% */
        color: var(--red);

        text-align: center;

        @media screen and (max-width: ${BREAKPOINT}) {
            margin: 0px 0 10px;
        }
    }

    button {
        align-self: flex-end;
        font-family: MullerBold;
        text-transform: uppercase;
        color: white;
        ${({ withMap }) => withMap ? `width: 100%;` : `width: 300px;`}

        
        height: 39px;
        left: 260px;
        top: 617px;

        /* Rojo Sofía */
        border: none;
        background: #E30613;
        box-shadow: 0px 8px 29px rgba(227, 6, 19, 0.39);
        border-radius: 44px;

        @media screen and (max-width: ${BREAKPOINT}) {
            font-size: 12px;
        }
    }
    @media screen and (max-width: ${BREAKPOINT}) {
        align-items: center;
        justify-content: center;
        margin-right: 0;
    }
`

const Title = styled.h3`
    margin-top: 17px;
    font-family: MullerMedium;

    font-size: 24px;
    line-height: 32px;

    @media screen and (max-width: ${BREAKPOINT}) {
        margin-top: 10px;
        align-text: center;   
        font-size: 20px;
    }
`
const Subtitle = styled.h4<{ withMap: boolean }>`
    margin-top: 8px;
    font-family: MullerMedium;

    font-size: 16px;
    line-height: 20px;
    max-width: 300px;
    ${({ withMap }) => withMap ?
        ` text-align: left;` :
        ` text-align: center;`
    }

    @media screen and (max-width: ${BREAKPOINT}) {
        margin-top: 6px;
        font-size: 14px;   
    }
`

const Addresses = styled.div<{ withMap: boolean }>`
    width: 100%;
    margin: 10px 0;
    display: flex;
    ${({ withMap }) => withMap ?
        `   align-items: flex-start;
        justify-content: flex-start;`
        :
        `   align-items: flex-start;
        justify-content: flex-start;
        margin-left: 120px;
    `
    }

    flex-direction: column;
    flex-grow:1;
    max-height: 230px;
    overflow: auto;
    @media screen and (max-width: ${BREAKPOINT}) {
        margin-left: 0px;

    }
`
const RadionGroup = styled.div<{ selected: boolean }>`
  /* display: flex; */
  display: grid;
  grid-template-columns: 16px 1fr;

  padding: 5px 10px;
  border-radius: 30px;
  margin-top: 10px;
  border: 1px solid transparent;
  cursor: pointer;
  text-align: left;
  &.selected {
    border: 1px solid var(--red);
  }
  input {
    cursor: pointer;
    -webkit-appearance: none;
    display: inline-block;
    vertical-align: middle;
    width: 16px;
    height: 16px;
    border-radius: 100%;
    border: 1px solid var(--red);
    &:checked {
      background: var(--red);
      box-shadow: 0 0 0 3px white inset;
    }
  }
  label {
    cursor: pointer;
    font-family: MullerMedium;
    font-size: 14px;
    line-height: 14px;
    ${({ selected }) =>
        selected ?
            `
        color: var(--red);
        `
            :
            `
        color: var(--black);
        `
    }
    margin-left: 10px;
  }
`;
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
    lat: number,
    lng: number,
    name?: string,
    street?: string
}


const AddressDetail: FC<Props> = ({
    setStep,
    setShippingMethod,
    shippingMethod,
    setChangeModalVisible,
    setModalStepType,
    setNewAddressText
}) => {
    const { t } = useTranslation();
    const { data } = useQuery(GET_USER, {});
    const minimumPrice = useMinimumPrice()
    const { agency, agencies, city: cityHook, hasB2EAddress } = useCityPriceList()
    const [withMap, setWithMap] = useState<boolean>(true);
    const [city, setCity] = useState<User>({});
    const [agencyKey, setagencyKey] = useState<string>("");
    const [setUser] = useMutation(SET_USER, { variables: { user: city } });
    const [setUserMinimumPrice] = useMutation(SET_USER, {});

    const [selectedAddress, setSelectedAddress] = useState<AddressType | Agency | any>();
    const [centerMap, setCenterMap] = useState<Point>({
        lat: parseFloat("-17.80904437441624"),
        lng: parseFloat("-63.20539010110378")
    } as Point);
    const [inputs, setInputs] = useState<UserType>({ addresses: [] });
    const [userId, setUserId] = useState(0);

    const [getDetails, { data: userDetails }] = useLazyQuery(DETAILS, {
        fetchPolicy: "network-only",
        onCompleted: d => {
            setUserId(d.details.id);
            setInputs(d.details);
        }
    });


    const changeCity = (c: KeyValue) => {
        setCity({
            cityKey: c.key,
            cityName: c.value,
            defaultAddressLabel: c.value,
            defaultAddressId: undefined,
            openCityModal: false,
            idPriceList: 0,
            agency: null
        });
    };


    const handleSetCity = async (isAddress: boolean) => {
        if (agency) {
            setModalStepType(Changes.PickupToDelivery);
        } else {
            setModalStepType(Changes.DeliveryToDelivery);
        }

        if (isAddress) {
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
                            idPriceList: selectedAddress?.id_price_list || 0 
                        }
                    }
                });
                setNewAddressText(selectedAddress?.street)
            }
        } else {
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
                            idPriceList: selectedAddress?.id_price_list || 0 
                        }
                    }

                })
                setNewAddressText(findCity(city.cityKey))
            };
        }

        setChangeModalVisible(true);
        setStep(Steps.Choosing)
    }

    const handleSetAgency = async () => {
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
                    idPriceList: 0
                }
            }
        });

        setChangeModalVisible(true);
        setNewAddressText(selectedAddress?.name);
        setStep(Steps.Choosing);
        setUserMinimumPrice({
            variables: { user: { showMinimumPrice: String("show") } }
        });
    }

    useEffect(() => {
        if (data.userInfo.length &&
            data.userInfo[0].cityKey) {
            setCity(data.userInfo[0].cityKey)
        }
    }, [data])

    useEffect(() => {
        if (shippingMethod === ShippingMethod.Delivery &&
            inputs.addresses && !!inputs.addresses.length) {
            setSelectedAddress(inputs.addresses[0])
        }

    }, [inputs])

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

    return <>
        <Wrapper withMap={withMap}>

            {shippingMethod === ShippingMethod.Pickup &&
                <Selector withMap={withMap}>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M26 1H6L1 10C1 12.762 3.238 15 6 15C8.762 15 11 12.762 11 10C11 12.762 13.238 15 16 15C18.762 15 21 12.762 21 10C21 12.762 23.238 15 26 15C28.762 15 31 12.762 31 10L26 1Z" stroke="#E30613" strokeWidth="2.6" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M27 19V31H5V19" stroke="#E30613" strokeWidth="2.6" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M13 31V23H19V31" stroke="#E30613" strokeWidth="2.6" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <Title>Retira al paso</Title>
                    <Subtitle withMap={withMap}>Elige tu tienda más cercana</Subtitle>
                    <Addresses withMap={withMap}>
                        {agencies.map((_agency: Agency, index: number) =>
                            <RadionGroup
                                key={`${_agency.key}#${index}`}
                                className={(agencyKey === _agency.key || _agency.key === selectedAddress?.key) ? "selected" : ``}
                                selected={false}
                                onClick={() => {
                                    setSelectedAddress({ ..._agency, isAgency: true })
                                    setagencyKey(_agency.key)
                                    setCenterMap({
                                        lat: parseFloat(_agency.latitude),
                                        lng: parseFloat(_agency.longitude)
                                    } as Point)
                                }}
                            >
                                <input
                                    readOnly
                                    name="agency"
                                    checked={(agencyKey === _agency.key || _agency.key === selectedAddress?.key)}
                                    type="radio" />
                                <label>{_agency.name}</label>
                            </RadionGroup>
                        )}
                    </Addresses>
                    {withMap ?
                        <a onClick={() => setWithMap(false)}>Cerrar el mapa</a>
                        :
                        <a onClick={() => setWithMap(true)}>Ver en mapa</a>
                    }

                    <button onClick={handleSetAgency}>Confirmar</button>

                </Selector>
            }

            {shippingMethod === ShippingMethod.Delivery &&
                <Selector withMap={withMap}>
                    <svg width="36" height="38" viewBox="0 0 36 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.1905 2L2 14.9524V36H13.3333V24.6667H23.0476V36H34.381V14.9524L18.1905 2Z" stroke="#E30613" strokeWidth="2.6" strokeMiterlimit="10" strokeLinecap="square" />
                    </svg>
                    <Title>Envío a domicilio</Title>
                    <Subtitle withMap={withMap}>Selecciona una de tus direcciones guardadas o agrega una nueva:</Subtitle>
                    <Addresses withMap={withMap}>
                        {/* when no addresses */}
                        {inputs.addresses && !inputs.addresses.length ?
                            <>
                                {cities.map((c: KeyValue) => (
                                    <RadionGroup
                                        selected={true}
                                        key={c.key}
                                        onClick={() => {
                                            changeCity(c)
                                            setSelectedAddress({ street: c.value })
                                        }}
                                    >
                                        <input
                                            readOnly
                                            id={`city${c.key}`}
                                            name="city"
                                            type="radio"
                                            checked={
                                                (city && city.cityKey === c.key) 
                                            } />
                                        <label>{c.value}</label>
                                    </RadionGroup>
                                ))}
                            </>
                            :
                        // when addresses
                            <>
                                {inputs.addresses &&
                                    React.Children.toArray(inputs.addresses
                                            .filter((address:AddressType) => hasB2EAddress ? address.id_price_list : address )
                                            .map((address: AddressType) => (
                                        <RadionGroup
                                            selected={selectedAddress?.id === address.id}
                                            onClick={() => {
                                                setSelectedAddress({ ...address })
                                                setCenterMap({
                                                    lat: parseFloat(address?.latitude || "0"),
                                                    lng: parseFloat(address?.longitude || "0")
                                                } as Point)
                                            }}
                                        >
                                            <input
                                                readOnly
                                                id={`city${address.id}`}
                                                name="city"
                                                type="radio"
                                                checked={
                                                    !!(
                                                        selectedAddress?.id === address.id
                                                    )
                                                }
                                            />
                                            <label>{address?.street?.replace(/ \| /g, " ")}
                                                {address?.id_price_list ?
                                                    <StarWrap>
                                                        <img src={StarIcon} alt="" />
                                                        <TooltipStar>
                                                            {t("account.tooltip_star_msg")}
                                                        </TooltipStar>
                                                    </StarWrap>
                                                    : null}
                                            </label>


                                        </RadionGroup>
                                    )))}
                            </>
                        }

                    </Addresses>
                    {withMap ?
                        <a onClick={() => setWithMap(false)}>Cerrar el mapa</a>
                        :
                        <a onClick={() => setWithMap(true)}>Ver en mapa</a>
                    }

                    <button onClick={() => handleSetCity(!(inputs.addresses && !inputs.addresses.length))}>Confirmar</button>
                </Selector>
            }

            {withMap &&
                <Maps>
                    <GoogleMapReact
                        bootstrapURLKeys={{
                            key: "AIzaSyD-ytvHpafjsy_r9WbqGTj09_wkYuQAjSk"
                        }}
                        defaultZoom={15}
                        defaultCenter={centerMap}
                        center={centerMap}
                        options={{
                            fullscreenControl: false
                        }}
                    >
                        {shippingMethod === ShippingMethod.Pickup && React.Children.toArray(agencies.map(({ name, street, latitude, longitude, key }: Agency) =>
                            <Marker
                                lat={parseFloat(latitude)}
                                lng={parseFloat(longitude)}
                                text={street}
                                name={name}
                                maxWidth={"400px"}
                                selected={!!(key === selectedAddress?.key || key === agency)}

                            />
                        ))}
                        {shippingMethod === ShippingMethod.Delivery && inputs.addresses && !!inputs.addresses.length &&
                            React.Children.toArray(
                                inputs.addresses.map((address: AddressType) =>
                                    <Marker
                                        lat={parseFloat(address.latitude || "0")}
                                        lng={parseFloat(address.longitude || "0")}
                                        text={address.street}
                                        name={" "}
                                        maxWidth={"400px"}
                                        selected={!!(selectedAddress?.id === address.id)}
                                    />
                                )
                            )}
                    </GoogleMapReact>
                </Maps>
            }
        </Wrapper>
    </>
}

export default AddressDetail