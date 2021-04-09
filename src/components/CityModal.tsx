import React, { FC, Suspense, useState, useEffect } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cities, KeyValue } from "../utils/string";
import { BREAKPOINT } from "../utils/constants";
import { useMutation, useQuery, useLazyQuery } from "react-apollo";
import { SET_USER } from "../graphql/user/mutations";
import { GET_USER, DETAILS } from "../graphql/user/queries";
import { UserType, AddressType } from "../graphql/user/type";
import StarIcon from "../assets/images/star.svg";

const Loader = React.lazy(
  () => import(/* webpackChunkName: "Loader" */ "./Loader")
);
const WorldPin = React.lazy(
  () => import(/* webpackChunkName: "WorldPin" */ "./Images/WorldPin")
);
const Close = React.lazy(
  () => import(/* webpackChunkName: "Close" */ "./Images/Close")
);

const Cta = React.lazy(() => import(/* webpackChunkName: "Cta" */ "./Cta"));

const Courtain = styled.div<any>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: none;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  z-index: 4;
  &.visible {
    display: flex;
  }
`;

const Modal = styled.div`
  position: relative;
  background: white;
  border-radius: 10px;
  padding: 50px;
  text-align: center;
  @media screen and (max-width: ${BREAKPOINT}) {
    margin: 0 20px;
    padding: 20px 40px;
  }
`;

const CloseWrapper = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  > svg {
    width: 12px;
    height: 12px;
  }
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
  color: var(--font);
  max-width: 400px;
  margin-bottom: 30px;
`;

const Radios = styled.div`
  text-align: left;
  max-width: fit-content;
  margin: 0 auto;
`;

const RadionGroup = styled.div<any>`
  /* display: flex; */
  padding: 5px 10px;
  border-radius: 30px;
  margin-top: 10px;
  border: 1px solid transparent;
  cursor: pointer;
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
    color: var(--red);
    margin-left: 10px;
  }
`;

const CtaWrapper = styled.div`
  margin-top: 30px;
  button {
    padding: 15px 50px;
  }
`;
const StarWrap = styled.div`
  position: relative;
  display: inline-block;
  &:hover {
    > div {
      opacity: 1;
      visibility: visible;
    }
  }
`;
const TooltipStar = styled.div`
  text-align: center;

  padding: 20px 10px;
  width: 287px;
  background: #f0f0f0;
  border-radius: 8px;
  font-size: 12px;
  line-height: 18px;

  left: 50%;
  margin-left: -141px;
  right: 0;
  top: 30px;

  color: #1a1a1a;
  position: absolute;

  transition: all ease-out 0.2s;

  opacity: 0;
  visibility: hidden;

  z-index: 2;

  /* &.hover {
    opacity: 1;
    visibility: visible;
  } */

  &:before {
    content: "";
    width: 20px;
    height: 20px;
    background-color: #f0f0f0;
    transform: rotate(45deg);
    position: absolute;
    top: -5px;
    left: 50%;
    margin-left: -10px;
  }

  @media (max-width: ${BREAKPOINT}) {
    display: none;
  }
`;


type Props = {};

type User = {
  cityKey?: string;
  cityName?: string;
  openCityModal?: boolean;
  defaultAddressId?: number;
  defaultAddressLabel?: string;
  employee?: string;
  idPriceList?: number;
};

const CityModal: FC<Props> = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { data } = useQuery(GET_USER, {});
  const [inputs, setInputs] = useState<UserType>({ addresses: [] });
  const [city, setCity] = useState<User>({});
  const [setUser] = useMutation(SET_USER, { variables: { user: city } });
  const [showSuccess] = useMutation(SET_USER, {})
  const [toggleCityModal] = useMutation(SET_USER, {
    variables: { user: { openCityModal: false } as User }
  });
  const [getDetails, {data: userDetails}] = useLazyQuery(DETAILS, {
    fetchPolicy: "network-only",
    onCompleted: d => {
      setUserId(d.details.id);
      setInputs(d.details);
    }
  });
  
  const [userId, setUserId] = useState(0);

  const changeCity = (c: KeyValue) => {
    setCity({
      cityKey: c.key,
      cityName: c.value,
      openCityModal: false,
      idPriceList: 0
    });
  };

  const setDefaultAddress = async (address: any) => {
    let c: KeyValue | undefined = cities.find(
      (c: KeyValue) => c.value === address.city
    );
    const prev = data?.userInfo[0]?.idPriceList || 0
    let newVal = 0

    if (parseInt(address?.reference) &&
    parseInt(address?.phone) &&   
    address?.phone === address?.reference
    ) {
      newVal = parseInt(address?.phone)
    }

    if (prev > 0 && newVal === 0) {
      showSuccess({
        variables: { user: { showModal: t("cart.change_employee") } }
      });
    } else {
      showSuccess({
        variables: { user: { showModal: t("cart.change_msg") } }
      });
    }
    await setUser({
      variables: {
        user: {
          defaultAddressId: address.id,
          defaultAddressLabel: address.street,
          openCityModal: false,
          cityKey: c?.key,
          cityName: c?.value,
          idPriceList: address?.phone && address?.reference && address?.phone === address?.reference  && !isNaN(parseInt(address?.reference)) ? parseInt(address?.reference) : 0 
        }
      }
    });
  };

  const resetToDefaultCities = () => {
    toggleCityModal({
      variables: {
        user: {
          cityKey: "",
          cityName: "",
          openCityModal: false,
          defaultAddressId: undefined,
          defaultAddressLabel: "",
          idPriceList: 0
        } as User
      }
    });
  };

  const addAddress = () => {
    toggleCityModal();
    history.push("/mi-cuenta?na");
  };

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
    toggleCityModal();
    const userInfo = data && data.userInfo.length ? data.userInfo[0] : {};
    if (!userInfo.cityKey) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            const latitude = "latitude=" + position.coords.latitude;
            const longitude = "&longitude=" + position.coords.longitude;
            const query = latitude + longitude + "&localityLanguage=es";
            const Http = new XMLHttpRequest();
            const bigdatacloud_api =
              "https://api.bigdatacloud.net/data/reverse-geocode-client?" +
              query;
            Http.onreadystatechange = function () {
              if (this.readyState == 4) {
                if (this.status == 200) {
                  const myObj = JSON.parse(this.responseText);
                  if (myObj.principalSubdivision) {
                    if (myObj.principalSubdivision.indexOf("Cochabamba") >= 0)
                      changeCity(cities[0]);
                    else if (myObj.principalSubdivision.indexOf("La Paz") >= 0)
                      changeCity(cities[1]);
                    else if (myObj.principalSubdivision.indexOf("El Alto") >= 0)
                      changeCity(cities[2]);
                    else changeCity(cities[2]);
                  }
                } else {
                  changeCity(cities[2]);
                }
              }
            };
            Http.open("GET", bigdatacloud_api);
            Http.send();
          },
          function (errors) {
            changeCity(cities[2]);
          },
          {
            timeout: 2000
          }
        );
      } else {
        changeCity(cities[2]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const userInfo = data && data.userInfo.length ? data.userInfo[0] : {};
    if (userId > 0 && inputs.addresses?.length && !userInfo.defaultAddressId) {
      // showUserAddresses();
      const street = inputs?.addresses[0].street ?? "";
      const city = inputs?.addresses[0].city ?? "";
      let c: KeyValue | undefined = cities.find(
        (c: KeyValue) => c.value === city
      );
      setUser({
        variables: {
          user: {
            defaultAddressId: inputs.addresses[0].id,
            defaultAddressLabel: street.replace(/ \| /g, " "),
            cityKey: c ? c.key : "",
            cityName: c ? c.value : "",
            openCityModal: false,
            idPriceList:  0
          }
        }
      });
    } else if (userId === 0 && !userInfo.cityKey) resetToDefaultCities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs]);

  useEffect(() => {
    if (city.cityKey) setUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]);

  return (
    <Suspense fallback={<Loader />}>
      <Courtain
        className={
          (!data.userInfo.length ||
            // !data.userInfo[0].cityKey ||
            data.userInfo[0].openCityModal) &&
          !data.userInfo[0].openAddressModal &&
          "visible"
        }
      >
        {inputs.addresses && !inputs.addresses.length && (
          <Modal>
            {!!data.userInfo.length && data.userInfo[0].cityKey && (
              <CloseWrapper onClick={() => toggleCityModal()}>
                <Close />
              </CloseWrapper>
            )}
            <WorldPin />
            <Title>{t("citymodal.title")}</Title>
            <Text>{t("citymodal.text")}</Text>
            <Radios>
              {cities.map((c: KeyValue) => (
                <RadionGroup
                  className={
                    data.userInfo.length &&
                    data.userInfo[0].cityKey === c.key &&
                    "selected"
                  }
                  onClick={() => changeCity(c)}
                  key={c.key}
                >
                  <input
                    readOnly
                    id={`city${c.key}`}
                    name="city"
                    type="radio"
                    checked={
                      !!(
                        data.userInfo.length &&
                        data.userInfo[0].cityKey === c.key
                      )
                    }
                  />
                  <label>{c.value}</label>
                </RadionGroup>
              ))}
            </Radios>
            {data.userInfo.length && data.userInfo[0].id && (
              <CtaWrapper>
                <Cta
                  filled={true}
                  text={t("citymodal.add_address")}
                  action={addAddress}
                />
              </CtaWrapper>
            )}
          </Modal>
        )}
        {inputs.addresses && !!inputs.addresses.length && (
          <Modal>
            <CloseWrapper onClick={() => toggleCityModal()}>
              <Close />
            </CloseWrapper>
            <WorldPin />
            <Title>{t("citymodal.title_alt")}</Title>
            <Text>{t("citymodal.text_alt")}</Text>
            <Radios>
              {inputs.addresses &&
                inputs.addresses.map((address: AddressType) => (
                  <RadionGroup
                    className={
                      data.userInfo.length &&
                      data.userInfo[0].defaultAddressId === address.id &&
                      "selected"
                    }
                    onClick={() => setDefaultAddress({...address, idPriceList:0})}
                    key={address.id}
                  >
                    <input
                      readOnly
                      id={`city${address.id}`}
                      name="city"
                      type="radio"
                      checked={
                        !!(
                          data.userInfo.length &&
                          data.userInfo[0].defaultAddressId === address.id
                        )
                      }
                    />


                    {address?.phone && address?.reference && address?.phone === address?.reference  && !isNaN(parseInt(address?.reference)) ? (
                      <><label>{address?.street?.split("|")[0]}</label>

                      <StarWrap>
                        <img src={StarIcon} alt="" />
                        <TooltipStar>
                          {t("account.tooltip_star_msg")}
                        </TooltipStar>
                      </StarWrap>
                    </>) : (
                      <label>{address?.street?.replace(/ \| /g, " ")}</label>

                    ) }
                  </RadionGroup>
                ))}
            </Radios>
            <CtaWrapper>
              <Cta
                filled={true}
                text={t("citymodal.add_address")}
                action={addAddress}
              />
            </CtaWrapper>
          </Modal>
        )}
      </Courtain>
    </Suspense>
  );
};

export default CityModal;
