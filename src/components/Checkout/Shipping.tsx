import React, { FC, Suspense, useState, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { BREAKPOINT } from "../../utils/constants";
import { cities, KeyValue } from "../../utils/string";
import { setLatLng } from "../../utils/googlemaps";
import { useQuery, useMutation } from "react-apollo";
import { DETAILS, GET_USER } from "../../graphql/user/queries";
import { AddressType } from "../../graphql/user/type";
import { SET_USER } from "../../graphql/user/mutations";
import StarIcon from "../../assets/images/star.svg";
import { GET_SAP_AGENCIES } from "../../graphql/products/queries";
import useCityPriceList from "../../hooks/useCityPriceList";
import Agency from "../../types/Agency";

const Loader = React.lazy(() =>
  import(/* webpackChunkName: "Loader" */ "../Loader")
);
const Map = React.lazy(() => import(/* webpackChunkName: "Map" */ "../Map"));
const Switch = React.lazy(() =>
  import(/* webpackChunkName: "Switch" */ "../Switch")
);
const Chevron = React.lazy(() =>
  import(/* webpackChunkName: "Chevron" */ "../Images/Chevron")
);

const gridSpan2CSS = {
  gridColumn: "1 / span 2"
} as React.CSSProperties

const emptyCSS = {} as React.CSSProperties

const Container = styled.div``;

const Title = styled.div`
  display: flex;
  margin-bottom: 30px;
  h2 {
    font-family: MullerMedium;
    font-size: 16px;
    line-height: 16px;
    color: var(--red);
    flex: 1;
  }
  span {
    font-family: MullerMedium;
    font-size: 12px;
    line-height: 12px;
    color: var(--black);
  }
  @media screen and (max-width: ${BREAKPOINT}) {
    flex-direction: column;
    span {
      margin-top: 10px;
    }
  }
`;

const Form = styled.div<{ hidden: boolean }>`
  display: ${props => (props.hidden ? "none" : "grid")};
  grid-template-columns: 1fr 1fr;
  column-gap: 24px;
  row-gap: 30px;
  @media screen and (max-width: ${BREAKPOINT}) {
    grid-template-columns: 1fr;
    column-gap: 0;
  }
`;

const InputGroup = styled.div<{ key: string; withLabel: boolean }>`
  display: flex;
  flex-direction: column;
  label {
    font-family: MullerMedium;
    font-size: 10px;
    line-height: 10px;
    letter-spacing: 0.01em;
    text-transform: uppercase;
    color: var(--font);
    padding-left: 20px;
    opacity: ${props => (props.withLabel ? "1" : "0")};
  }
  input {
    background: var(--whiter);
    border-radius: 44px;
    font-family: MullerMedium;
    font-size: 14px;
    line-height: 14px;
    display: flex;
    align-items: center;
    letter-spacing: 0.01em;
    color: var(--font);
    padding: 12px 20px;
    border: 0;
    margin-top: 10px;
    &.error {
      border: 1px solid var(--red);
    }
  }
`;

const OtherAddressWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

const Other = styled.button<{ margin: boolean }>`
  font-family: MullerMedium;
  font-size: 14px;
  line-height: 14px;
  text-decoration-line: underline;
  color: var(--red);
  border: 0;
  background: none;
  margin: 20px 0 ${props => (props.margin ? "40px" : "0")};
  &:hover {
    opacity: 0.8;
  }
`;

const CheckboxGroup = styled.div<{ red: boolean }>`
  display: grid;
  grid-template-columns: 20px 1fr 13px;

  align-items: center;
  margin-bottom: 20px;
  input {
    -webkit-appearance: none;
    border: 2px solid var(--${props => (props.red ? "red" : "font")});
    border-radius: 4px;
    width: 20px;
    height: 20px;
    cursor: pointer;
    &:checked {
      background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAqCAYAAAD1T9h6AAAACXBIWXMAACxLAAAsSwGlPZapAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJsSURBVHgB1ZhRbtNAEIZn13FA4sVqi8RDIrU3SG9QH6EnQJwAeOONcoLCSSJOkN6gvQEVzhtN8SPUjpcdU1Vpas/O2rvx9pMsRd6J/Y9n91+PAZ4BPyA5zOL9hT5+Z+N9pY85nsMxAYGDQkdxdKmVJltDeXm3Po4gYFB8PI4WWvybhuGXUspZsBXQ4hMt/lIBHBJhuYRA0dNmbhCPJEEm8DPeO9fT5sQUpxP8HtwUysYHn7W0M2OgUnkZVcdBJZDFe+9BiK+s4Eqk0/LmYgSBkI2SE654IcTHiRaPv4NIoN6URDTnRasvk7+rh0QH3wcMXv8YBd+mxe2nzVODrgGm1/9HwcW0WKXbpwe1UabX66esrstX69OmscES4Ho9ii9klR7led48PgC2Xn/0J79uC9l5Al28ngrZqY129XqKnSXQx+spdrIP9PV6Cu9rwIXXU8j7m7T2nH1x4fXk/6ieUyiZTopfV9AR9Hq9GD+Y4h68nrDLNuRoHJ03iEcSJarFMn49gw6g13PEo9d3FY8InDKGGOtKuPZ6ColPwBBjVQlbr+8jHtGLWHCeLCsJe6+/4VWJQJbR+h2jCgiZxIbXJ8Yrodff3Z6BA+p9YBknMwVS31yYb96wJnx7PUW9D0yK/EpAlXathG+vp6+5QZdKVLB+69vr6etuYZkED8Z7fVeedGSW04mHkqc+xCONLaXLJFx4PUVrT+wmCTdeT2F8ne68Jur3+pX5XagnrH7AOgnHXk/B+qxiM518eD0F+7sQJwnTNxwfWLeUrdPJo9dTWH+Za62ER6/3AlZCNy51D718ceDdbbyASQwt/h8riHszQZr28wAAAABJRU5ErkJggg==");
      background-position: center center;
      background-size: 12px;
      background-repeat: no-repeat;
    }
  }
  label {
    font-family: MullerMedium;
    font-size: 14px;
    line-height: 14px;
    color: var(--font);
    padding-left: 10px;
    cursor: pointer;
  }
`;

const SelectWrapper = styled.div`
  position: relative;
  cursor: pointer;

  select {
    -webkit-appearance: none;
    width: 100%;
    background: var(--whiter);
    border-radius: 44px;
    font-family: MullerMedium;
    font-size: 14px;
    line-height: 14px;
    display: flex;
    align-items: center;
    letter-spacing: 0.01em;
    color: var(--font);
    padding: 10px 20px;
    border: 0;
    margin-top: 10px;
    cursor: pointer;
  }

  svg {
    pointer-events: none;
    position: absolute;
    top: 24px;
    right: 20px;
    path {
      stroke: var(--red);
    }
  }
`;
const StarWrap = styled.div`
  position: relative;
  padding:0 0 2px 5px;

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

type Props = {
  updateOrder: Function;
  orderData: any;
  billingChange: any;
  confirmModalVisible: boolean;
  localUserData: any;
  setOrderIsReady: Function;
};

const Shipping: FC<Props> = ({
  updateOrder,
  orderData,
  billingChange,
  confirmModalVisible,
  localUserData,
  setOrderIsReady
}) => {
  const { t } = useTranslation();
  const [inputs, setInputs] = useState<any>({
    addressType: t("checkout.delivery.street")
  });
  const [agencies, setAgencies] = useState<any>([])
  const { data: localData } = useQuery(GET_USER, {});
  const [showSuccess] = useMutation(SET_USER, {})

  const {} = useQuery(GET_SAP_AGENCIES, {
    fetchPolicy: "network-only",
    onCompleted: d => {
      setAgencies(d.agencies)
    }
  })

  const [other, setOther] = useState(false);
  const { data: userData } = useQuery(DETAILS, {
    fetchPolicy: "network-only"
  });
  const [setUser] = useMutation(SET_USER);
  const { agency, setAgency } = useCityPriceList()

  const onChange = (
    key: string,
    value: string | number | null,
    preventMap: boolean = false
  ) => {
    if (key.indexOf("phone") >= 0 && String(value).length > 8)
      value = String(value).substring(0, 8);
    setInputs({
      ...inputs,
      [key]: value
    });
    if (key === "city" && value && !preventMap) {
      setLatLng(String(value));
      let c: KeyValue | undefined = cities.find(
        (c: KeyValue) => c.value === value
      );
      if (c) {
        setUser({
          variables: {
            user: {
              cityKey: c.key,
              cityName: c.value,
              openCityModal: false,
              defaultAddressId: null,
              defaultAddressLabel: ""
            }
          }
        });
      }
    }
  };

  const selectAddress = (address: AddressType | any) => {
    if (address && address.id) {
      onChange("addressId", Number(address.id));
      updateOrder("shipping", address);
      setOther(false);
      let c: KeyValue | undefined = cities.find(({ value }: KeyValue) => value === address.city);

      if (!c) {
        let city: KeyValue | undefined = cities.find(({ key }:KeyValue) => key === address.city) 
        if (city) {
          setUser({
            variables: {
              user: {
                cityKey: city.key,
                cityName: city.value
              }
            }
          })
        }
      }

      if (c) {
        setUser({
          variables: {
            user: {
              cityKey: c.key,
              cityName: c.value
            }
          }
        })
      }

      (window as any).latitude = address.latitude;
      (window as any).longitude = address.longitude;
      const prev = localData?.userInfo[0]?.idPriceList || 0
      const newVal = address?.id_price_list || 0
  
      // check if pick-up address
      if (address && address.isAgency) {
        showSuccess({
          variables: { user: { showModal: "Cambiaste de dirección|Recuerda que al elegir esta dirección debes pasar a retirar a la agencia Sofía al Paso seleccionada." } }
        });
        setUser({
          variables: {
            user:{
              agency: address.key
            }
          }
        })
      } else {
        setAgency(null)

        if (prev > 0 && newVal == 0) {
          showSuccess({
            variables: { user: { showModal: t("cart.change_employee") } }
          });
        } else {
          if (localData?.userInfo[0]?.cityName !== address?.city) {
            setOrderIsReady(true)
            showSuccess({
              variables: { user: { showModal: t("cart.change_msg") } }
            });
          }
        }
        
        setUser({
          variables: {
            user: {
              openCityModal: false,
              defaultAddressId: address.id,
              defaultAddressLabel: address.street,
              idPriceList: address?.id_price_list || 0,
              agency: null
            }
          }
        })
      }
    }
  };

  const showOther = () => {
    setOther(true);
    onChange("addressId", null);
  };

  const addressTypes = [
    {
      title: t("checkout.delivery.street"),
      value: t("checkout.delivery.street")
    },
    {
      title: t("checkout.delivery.avenue"),
      value: t("checkout.delivery.avenue")
    }
  ];

  const options: { [key: string]: Array<string> } = {
    city: cities.map((c: KeyValue) => c.value),
    home_type: ["Casa", "Departamento"]
  };

  useEffect(() => {
    if (localData.userInfo.length && other) {
      onChange("city", localData.userInfo[0].cityName, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [other]);

  useEffect(() => {
    if (!Object.keys(billingChange).length) return;
    let obj = { ...inputs };
    ["firstname", "lastname", "nit"].forEach((key: string) => {
      if (billingChange[key]) {
        obj[key] = billingChange[key];
      }
    });
    setInputs(obj);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billingChange]);

  useEffect(() => {
    if (
      localData &&
      localData.userInfo.length &&
      localData.userInfo[0].defaultAddressId &&
      userData && userData.details.addresses
    ) {
      if (!agency) {
        let _a = userData.details.addresses.findIndex(
          (a: AddressType) =>
            Number(a.id) === Number(localData.userInfo[0].defaultAddressId)
        );
        if (_a) selectAddress(userData.details.addresses[_a]);
        else selectAddress(userData.details.addresses[0]);
      }
      setOther(false)
    } else {
      if(!agency) {
        setOther(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData, agency]);

  useEffect(() => {
    if (!inputs.addressId)
      updateOrder("shipping", {
        ...inputs,
        latitude: (window as any).latitude,
        longitude: (window as any).longitude
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs]);

  return (
    <Suspense fallback={<Loader />}>
      <Container>
        <Title>
          <h2>{t("checkout.delivery.title")}</h2>
        </Title>
        {/* {agencies.map((_agency: Agency, index: number) =>        
          <CheckboxGroup red={!other} key={index}>
            <input
              type="radio"
              name="agencies"
              id=""
              onChange={() => selectAddress({ ..._agency, isAgency: true })}
              checked={agency === _agency.key}
            />
            <label>Retirar en: {_agency.name} - {_agency.street}</label>
          </CheckboxGroup>
        )} */}
        {userData &&
          userData.details.addresses &&
          userData.details.addresses.map((address: AddressType) => (
            <CheckboxGroup red={!other} key={address.id}>
              <input
                type="radio"
                checked={Number(address.id) === Number(inputs.addressId)}
                id={"address" + address.id}
                name="addressId"
                value={address.id}
                onChange={() => selectAddress(address)}
              />
              {address?.id_price_list ? (
                <>
                  <label onClick={() => selectAddress(address)}>
                    {address.street?.split("|")[0]}
                  </label>
                  <StarWrap>
                      <img src={StarIcon} alt="" />
                    <TooltipStar>
                      {t("account.tooltip_star_msg")}
                    </TooltipStar>
                  </StarWrap>
                </>
              ) :  (
                <label onClick={() => selectAddress(address)}>
                  {address.street?.replace(/ \| /g, " ")}
                </label>
              )}
            </CheckboxGroup>
          ))}

          <OtherAddressWrapper>
            <Other margin={!!other} onClick={showOther}>
              Ver mapa
            </Other>

            <Other margin={!!other} onClick={showOther}>
              {t("checkout.delivery.other_address")}
            </Other>
          </OtherAddressWrapper>

        <Form hidden={!other}>
          {[
            "firstname",
            "lastname",
            "phone",
            "phone2",
            "city",
            "address",
            "reference"
          ].map((key: string) => {
            return (
              <InputGroup withLabel={key !== "street"} key={key}
              style={key === "reference" ? gridSpan2CSS : emptyCSS}
              >
                <label>{t("checkout.delivery." + key)}</label>
                {options[key] && (
                  <SelectWrapper>
                    <select
                      name={`shipping-${key}`}
                      onChange={evt => onChange(key, evt.target.value)}
                      value={inputs[key] || ""}
                    >
                      <option value="">{t("checkout.delivery." + key)}</option>
                      {options[key].map((opt: string) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                    <Chevron />
                  </SelectWrapper>
                )}
                {(key === "address" || key === "reference") && (
                  <input
                    name={`shipping-${key}`}
                    value={inputs[key] || ""}
                    onChange={evt =>
                      onChange(key, evt.target.value)
                    }
                    type="text"
                    placeholder={t("checkout.delivery." + key + "_ph")}
                  />
                )}
                {key === "street" && (
                  <Switch
                    changeOption={(value: string) =>
                      onChange("addressType", value)
                    }
                    option={inputs.addressType}
                    values={addressTypes}
                  />
                )}
                {key !== "street" &&
                key !== "address" &&
                key !== "reference" &&
                !options[key] &&
                (
                  <input
                    name={`shipping-${key}`}
                    value={inputs[key] || ""}
                    onChange={evt => onChange(key, evt.target.value)}
                    pattern={
                      key.indexOf("phone") >= 0 || key === "nit" ? "[0-9]*" : ""
                    }
                    type={
                      key.indexOf("phone") >= 0 || key === "nit"
                        ? "number"
                        : "text"
                    }
                    placeholder={t("checkout.delivery." + key)}
                  />
                )}
              </InputGroup>
            );
          })}
        </Form>
        {other && !confirmModalVisible && <Map />}
      </Container>
    </Suspense>
  );
};

export default Shipping;
