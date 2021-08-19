import React, { FC, Suspense, useState, useEffect } from "react";
import styled from "styled-components";
import { cities, KeyValue } from "../../utils/string";
import { BREAKPOINT } from "../../utils/constants";
import { useMutation, useQuery, useLazyQuery } from "react-apollo";
import { SET_USER } from "../../graphql/user/mutations";
import { GET_USER, DETAILS } from "../../graphql/user/queries";
import { UserType } from "../../graphql/user/type";
import useCityPriceList from "../../hooks/useCityPriceList";
import { Changes, ShippingMethod, Steps } from "../CityModal/types";

const Loader = React.lazy(
  () => import(/* webpackChunkName: "Loader" */ "../Loader")
);

const ChooseShipping = React.lazy(
  () => import(/* webpackChunkName: "ChooseShipping" */ "../CityModal/ChooseShipping")
);

const AddressDetail = React.lazy(
  () => import(/* webpackChunkName: "AddressDetail" */ "../CityModal/AddressDetail")
);

const ChangeAddressTypeModal = React.lazy(
  () => import(/* webpackChunkName: "ChangeAddressTypeModal" */ "../CityModal/ChangeAddressTypeModal")
);


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
  z-index: 400;
  overflow: auto;
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
    width:100%;
    margin: 0 15px;
    padding: 20px 20px;
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

const BackWrapper = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }

`;


export const Radios = styled.div`
  text-align: left;
  max-width: fit-content;
  margin: 0 auto;
`;

export const RadionGroup = styled.div<any>`
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


type Props = {};

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

const CityModal: FC<Props> = () => {
  const { agency } = useCityPriceList();
  
  const { data } = useQuery(GET_USER, {});
  const [inputs, setInputs] = useState<UserType>({ addresses: [] });
  const [city, setCity] = useState<User>({});
  const [setUser] = useMutation(SET_USER, { variables: { user: city } });
  const [firstTime, setFirstTime] = useState<boolean>(true);

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

  const [changeModalVisible, setChangeModalVisible] = useState(false)
  const [modalStepType, setModalStepType] = useState<Changes>(Changes.PickupToPickup)
  const [newAddressText, setNewAddressText] = useState<string>("");

  const [step, setStep] = useState<Steps>(Steps.Choosing);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>(agency ? ShippingMethod.Pickup : ShippingMethod.Delivery);
  
  const [userId, setUserId] = useState(0);

  const changeCity = (c: KeyValue) => {
    setCity({
      cityKey: c.key,
      cityName: c.value,
      openCityModal: false,
      idPriceList: 0,
      agency: null
    });
  };

  useEffect(() => {
    toggleCityModal();
    const userInfo = data && data.userInfo.length ? data.userInfo[0] : {};
    if (!userInfo.cityKey && firstTime) {
      changeCity(cities[2]);
      setFirstTime(false)
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
                  // console.log("not status 200 reverse geocoding");
                }
              }
            };
            Http.open("GET", bigdatacloud_api);
            Http.send();
          },
          function (errors) {
            // console.log(errors, 'on error');
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
    // setear la direccion por defecto (la primera)
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
            idPriceList:  0,
            agency: null
          }
        }
      });
    }
    // else if (userId === 0 && !userInfo.cityKey) resetToDefaultCities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs]);

  useEffect(() => {
    if (city && city.cityKey) setUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]);

  return (
    <Suspense fallback={<Loader />}>
      <Courtain
        className={
          (data.userInfo.length &&
            data.userInfo[0].openCityModal)&&
          "visible"
        }
      >
          <Modal>
            <CloseWrapper onClick={async () => {
              setStep(Steps.Choosing)
              await toggleCityModal()
            }}>
              {/* close icon */}
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2L2 16" stroke="#808080" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
                <path d="M16 16L2 2" stroke="#808080" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
              </svg>
            </CloseWrapper>
            {step === Steps.Detailing && 
              <BackWrapper onClick={() => setStep(Steps.Choosing)}>
                {/* back icon */}
                <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.5 5.5H1" stroke="#2F2F2F" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5.5 1L1 5.5L5.5 10" stroke="#2F2F2F" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </BackWrapper>
            }
            {/* Back Icon above */}

            {step === Steps.Choosing &&
              <ChooseShipping
                setShippingMethod={setShippingMethod}
                setStep={setStep}
                isAgency={(agency !== null)}
                street={data?.userInfo[0]?.defaultAddressLabel || ""}
              />
              }
            {step === Steps.Detailing && 
              <AddressDetail
                shippingMethod={shippingMethod}
                setShippingMethod={setShippingMethod}
                setStep={setStep}
                setChangeModalVisible={setChangeModalVisible}
                setModalStepType={setModalStepType}
                setNewAddressText={setNewAddressText}

              />
            }

          </Modal>
      </Courtain>

      <ChangeAddressTypeModal
        text={newAddressText}
        visible={changeModalVisible}
        stepType={modalStepType}
        setVisible={setChangeModalVisible}
      />

    </Suspense>
  );
};

export default CityModal;
