import React, { FC, Suspense, useState, useEffect } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cities, KeyValue } from "../../utils/string";
import { BREAKPOINT } from "../../utils/constants";
import { useMutation, useQuery, useLazyQuery } from "react-apollo";
import { SET_USER } from "../../graphql/user/mutations";
import { GET_USER, DETAILS } from "../../graphql/user/queries";
import { UserType, AddressType } from "../../graphql/user/type";
import StarIcon from "../../assets/images/star.svg";

const Loader = React.lazy(
  () => import(/* webpackChunkName: "Loader" */ "../Loader")
);

const Cta = React.lazy(() => import(/* webpackChunkName: "Cta" */ "../Cta"));

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
                {/* close */}
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 2L2 16" stroke="#808080" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
                  <path d="M16 16L2 2" stroke="#808080" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
                </svg>
              </CloseWrapper>
            )}
            {/* worldpin */}
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5363 42.3901C13.7983 41.4571 14.7663 39.0861 14.7663 39.0861C14.7663 39.0861 15.8563 38.3291 16.1973 37.3631C16.5383 36.3971 16.2163 35.0851 16.2163 35.0851C16.2163 35.0851 17.1823 32.2491 16.7273 31.4541C16.2723 30.6591 14.3413 30.1471 14.3413 30.1471C14.3413 30.1471 13.5463 28.6701 11.8983 28.3861C10.8183 28.2721 9.73926 27.5341 9.73926 26.0001C9.73926 24.4661 11.2733 21.9661 11.2733 21.9661C11.2733 21.9661 12.8643 21.1881 13.0913 20.6201C13.3183 20.0521 13.3963 18.7281 13.3963 18.7281C13.3963 18.7281 14.9093 16.0581 14.0573 14.5231C13.7853 14.0341 12.5233 13.6711 12.5233 13.6711L10.7533 11.0161" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" />
              <path d="M39.7839 38.284C37.8539 37.359 34.4779 36.586 34.4779 36.586C34.4779 36.586 32.0109 33.84 30.3919 34.067C28.7729 34.294 27.1249 36.112 27.1249 36.112C27.1249 36.112 27.2389 39.464 26.7269 39.635C26.2159 39.805 24.8519 38.896 23.9999 39.578C23.1479 40.26 23.6389 42.182 23.6389 42.182C23.6389 42.182 21.7839 42.76 21.5569 43.385C21.3299 44.01 22.2319 45.402 22.4039 45.936" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" />
              <path d="M26.307 6.137C25.548 6.05 24.782 6 24 6C12.954 6 4 14.954 4 26C4 37.046 12.954 46 24 46C35.046 46 44 37.046 44 26C44 24.646 43.865 23.323 43.609 22.045" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" />
              <path d="M34 14C35.6569 14 37 12.6569 37 11C37 9.34315 35.6569 8 34 8C32.3431 8 31 9.34315 31 11C31 12.6569 32.3431 14 34 14Z" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
              <path d="M43 10.8C43 17 34 25 34 25C34 25 25 17 25 10.8C25 5.231 29.651 2 34 2C38.349 2 43 5.231 43 10.8Z" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
              <circle opacity="0.08" cx="24" cy="25" r="20" fill="#E30613" />
            </svg>
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
              {/* close */}
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2L2 16" stroke="#808080" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
                <path d="M16 16L2 2" stroke="#808080" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
              </svg>
            </CloseWrapper>
            {/* world pin */}
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5363 42.3901C13.7983 41.4571 14.7663 39.0861 14.7663 39.0861C14.7663 39.0861 15.8563 38.3291 16.1973 37.3631C16.5383 36.3971 16.2163 35.0851 16.2163 35.0851C16.2163 35.0851 17.1823 32.2491 16.7273 31.4541C16.2723 30.6591 14.3413 30.1471 14.3413 30.1471C14.3413 30.1471 13.5463 28.6701 11.8983 28.3861C10.8183 28.2721 9.73926 27.5341 9.73926 26.0001C9.73926 24.4661 11.2733 21.9661 11.2733 21.9661C11.2733 21.9661 12.8643 21.1881 13.0913 20.6201C13.3183 20.0521 13.3963 18.7281 13.3963 18.7281C13.3963 18.7281 14.9093 16.0581 14.0573 14.5231C13.7853 14.0341 12.5233 13.6711 12.5233 13.6711L10.7533 11.0161" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" />
              <path d="M39.7839 38.284C37.8539 37.359 34.4779 36.586 34.4779 36.586C34.4779 36.586 32.0109 33.84 30.3919 34.067C28.7729 34.294 27.1249 36.112 27.1249 36.112C27.1249 36.112 27.2389 39.464 26.7269 39.635C26.2159 39.805 24.8519 38.896 23.9999 39.578C23.1479 40.26 23.6389 42.182 23.6389 42.182C23.6389 42.182 21.7839 42.76 21.5569 43.385C21.3299 44.01 22.2319 45.402 22.4039 45.936" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" />
              <path d="M26.307 6.137C25.548 6.05 24.782 6 24 6C12.954 6 4 14.954 4 26C4 37.046 12.954 46 24 46C35.046 46 44 37.046 44 26C44 24.646 43.865 23.323 43.609 22.045" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" />
              <path d="M34 14C35.6569 14 37 12.6569 37 11C37 9.34315 35.6569 8 34 8C32.3431 8 31 9.34315 31 11C31 12.6569 32.3431 14 34 14Z" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
              <path d="M43 10.8C43 17 34 25 34 25C34 25 25 17 25 10.8C25 5.231 29.651 2 34 2C38.349 2 43 5.231 43 10.8Z" stroke="#E30613" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
              <circle opacity="0.08" cx="24" cy="25" r="20" fill="#E30613" />
            </svg>
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
