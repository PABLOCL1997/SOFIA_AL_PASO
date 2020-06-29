import React, { FC, Suspense, useState, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { KeyValue } from "../utils/string";
import { BREAKPOINT } from "../utils/constants";
import { useMutation, useQuery, useLazyQuery } from "react-apollo";
import { SET_USER } from "../graphql/user/mutations";
import { GET_USER, DETAILS } from "../graphql/user/queries";
import { UserType, AddressType } from "../graphql/user/type";

const Loader = React.lazy(() =>
  import(/* webpackChunkName: "Loader" */ "./Loader")
);
const WorldPin = React.lazy(() =>
  import(/* webpackChunkName: "WorldPin" */ "./Images/WorldPin")
);
const Close = React.lazy(() =>
  import(/* webpackChunkName: "Close" */ "./Images/Close")
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
  z-index: 2;
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
};

const CityModal: FC<Props> = () => {
  const { t } = useTranslation();
  const { data } = useQuery(GET_USER, {});
  const [inputs, setInputs] = useState<UserType>({ addresses: [] });
  const [city, setCity] = useState<User>({});
  const [setUser] = useMutation(SET_USER, { variables: { user: city } });
  const [toggleCityModal] = useMutation(SET_USER, {
    variables: { user: { openCityModal: false } }
  });
  const [getDetails] = useLazyQuery(DETAILS, {
    fetchPolicy: "network-only",
    onCompleted: (d) => {
      setInputs(d.details);
    }
  });

  const cities: Array<KeyValue> = [
    { key: "CB", value: "Cochabamba" },
    { key: "LP", value: "La Paz" },
    { key: "SC", value: "Santa Cruz" },
    { key: "EA", value: "El Alto" }
  ];

  const changeCity = (c: KeyValue) => {
    setCity({
      cityKey: c.key,
      cityName: c.value,
      openCityModal: false
    });
  };

  const setDefaultAddress = (address: AddressType) => {
    setUser({
      variables: {
        user: {
          defaultAddressId: address.id,
          defaultAddressLabel: address.street,
          openCityModal: false
        }
      }
    });
  };

  useEffect(() => {
    if (data.userInfo.length && data.userInfo[0].cityKey) toggleCityModal();
    if (data.userInfo.length) getDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (city.cityKey) setUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]);

  return (
    <Suspense fallback={<Loader />}>
      <Courtain
        className={
          (!data.userInfo.length ||
            !data.userInfo[0].cityKey ||
            data.userInfo[0].openCityModal) &&
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
                    onClick={() => setDefaultAddress(address)}
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
                    <label>{address.street}</label>
                  </RadionGroup>
                ))}
            </Radios>
          </Modal>
        )}
      </Courtain>
    </Suspense>
  );
};

export default CityModal;
