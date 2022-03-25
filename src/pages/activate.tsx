import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import React, { Suspense, FC, useEffect, useState } from "react";
import { useTranslation, UseTranslationOptions } from "react-i18next";
import { useHistory } from "react-router-dom";
import Benefits from "../components/Activate/Benefits";
import ValidateOptions from "../components/Activate/ValidateOptions";
import InsertEmployeeCode from "../components/Activate/InsertEmployeeCode";
import ConfirmPhone from "../components/Activate/ConfirmPhone";
import Congrats from "../components/Activate/Congrats";
import InsertNit from "../components/Activate/InsertNit/InsertNit";
import Loading from "../components/Activate/Loading/Loading";
import ModifyAddress from "../components/Activate/ModifyAddress";
import WritePin from "../components/Activate/WritePin";
import { GET_USER2E_DETAILS } from "../graphql/b2e/queries";
import { ADD_ADDRESS, SET_EMPLOYEE, SET_USER, UPDATE_B2E_ADDRESS } from "../graphql/user/mutations";
import { CHECK_TOKEN, DETAILS } from "../graphql/user/queries";
import { AddressType } from "../graphql/user/type";
import { start, verify } from "../utils/authy";
import { findKeyByCity, titleCase } from "../utils/string";
import { token as Token } from "../utils/store";
import useUser from "../hooks/useUser";
import useCityPriceList from "../hooks/useCityPriceList";

enum ActivateState {
  Benefits,
  InsertNit,
  ValidateOptions,  
  ConfirmPhone,
  InsertEmployeeCode,
  WritePin,
  ModifyAddress,
  Congrats,
  Loading,
}

const Activate: FC = () => {
  const { t } = useTranslation("", { keyPrefix: "activate.steps" } as UseTranslationOptions);

  const ErrorNoUser: string = t("insert_nit.error");
  const ErrorNoAddress: string = t("insert_nit.no_address");
  const ErrorAuthy: string = t("confirm_phone.error");
  const InvalidPin: string = t("write_pin.error");
  const InvalidEmployeeId: string = t("insert_employee_code.error");
  const NoError: string = "";

  const history = useHistory();
  const { toggleLoginModal, user } = useUser();
  const { idPriceList } = useCityPriceList();
  const [state, setState] = useState<ActivateState>(ActivateState.Benefits);
  const [nit, setNit] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [street, setStreet] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [employeeCode, setEmployeeCode] = useState(0);
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [idAddress, setIdAddress] = useState<number>(0);
  const [address, setAddress] = useState<AddressType>({});
  const [authyId, setAuthyId] = useState<string>("");
  const [token, setToken] = useState<string>("");

  const [error, setError] = useState<string>("");
  const [updateB2EAddress] = useMutation(UPDATE_B2E_ADDRESS);

  const { data: userDetails } = useQuery(DETAILS, { fetchPolicy: "network-only" });
  const { data } = useQuery(CHECK_TOKEN, { fetchPolicy: "network-only" });
  const [getUserDetails] = useLazyQuery(DETAILS, {
    onCompleted: (d) => {
      if (d.details && d.details.addresses && d.details.addresses.length > 0) {
        // find the first b2e address
        const b2eAddress: AddressType = d.details.addresses.find((address: AddressType) => address.id_price_list);
        let fields;
        // if user has a b2e address
        if (b2eAddress) {
          // set the default address to b2e address
          fields = {
            defaultAddressId: b2eAddress?.id,
            defaultAddressLabel: b2eAddress?.street,
            cityKey: findKeyByCity(b2eAddress?.city as string) || "SC",
            cityName: b2eAddress?.city,
            agency: null,
            idPriceList: b2eAddress?.id_price_list || 0,
          };
          setStreet(b2eAddress?.street as string);
          setCity(b2eAddress?.city as string);
          setLatitude(b2eAddress?.latitude as string);
          setLongitude(b2eAddress?.longitude as string);
          setIdAddress(b2eAddress?.id_address_ebs as number);
          setAddress(b2eAddress);
          updateMainAddress({
            variables: {
              user: {
                ...fields,
              },
            },
          });
        }
      }
    },
  });
  const [updateMainAddress] = useMutation(SET_USER, {});
  const [updateEmployee] = useMutation(SET_EMPLOYEE, {});
  const [addAddress] = useMutation(ADD_ADDRESS, {});
  const [getB2EUser, { data: userB2E }] = useLazyQuery(GET_USER2E_DETAILS, {
    fetchPolicy: "network-only",
    onError: (d) => {
      setState(ActivateState.InsertNit);
      setError(ErrorNoUser);
    },
    onCompleted: (user) => {
      setError(NoError);
      if (!user.getB2EUserDetails.nombre || !user.getB2EUserDetails.nit) {
        setError(ErrorNoUser);
        setState(ActivateState.InsertNit);
      }      
      if (!user.getB2EUserDetails?.direcciones || !user.getB2EUserDetails?.direcciones.length) {
        setError(ErrorNoAddress);
        setState(ActivateState.InsertNit);
      } else {
        setName(user.getB2EUserDetails.nombre);
        setPhone(user.getB2EUserDetails.celular);
        setEmployeeCode(user.getB2EUserDetails['codigo_Empleado']);
        setState(ActivateState.ValidateOptions)
      }
    },
  });

  const handleStart = async () => {
    setState(ActivateState.Loading);

    if (!user.userInfo.length || !user.userInfo[0].isLoggedIn) {
      toggleLoginModal();
      setState(ActivateState.Benefits);
    } else {
      setState(ActivateState.InsertNit);
    }
  };

  const handleSetNit = async () => {
    setState(ActivateState.Loading);
    getB2EUser({
      variables: {
        nit: nit,
      },
    });
  };

  const handleOptionsNext = (option: string) => {
    if (option === 'sms') {
      setState(ActivateState.ConfirmPhone);
    } else {
      setState(ActivateState.InsertEmployeeCode);
    }
    setError(NoError);
  }

  const handleEmployeeCode = (value: string) => {
    if (Number(value) < 0 || String(employeeCode) !== value) {
      setError(InvalidEmployeeId);
    } else {
      handleVerify(false);
    }
  } 

  const handleConfirm = async () => {
    try {
      setState(ActivateState.Loading);
      const authyId = await start(phone, userDetails.details.email);
      if (!authyId) throw new Error(ErrorAuthy);
      setAuthyId(authyId);
      setState(ActivateState.WritePin);
    } catch (error) {
      setError(ErrorAuthy);
    }
  };

  const handleVerify = async (sms: boolean) => {
    try {
      setState(ActivateState.Loading);
      if (sms) {
        const response = await verify(authyId, token);
        if (!response) throw new Error(InvalidPin);
      }
      if (userB2E && userB2E.getB2EUserDetails && userB2E.getB2EUserDetails.direcciones) {
        await updateEmployee({
          // value 1 significa es empleado
          variables: {
            customer_id: userDetails?.details?.id || 0,
            value: userB2E?.getB2EUserDetails?.id_Cliente || 1,
          },
        });

        await Promise.all(
          userB2E.getB2EUserDetails.direcciones.map(async (address: any) => {
            await addAddress({
              variables: {
                addressId: 0,
                firstname: String(userB2E.getB2EUserDetails.nombre),
                lastname: " ",
                email: userDetails.details.email,
                nit: userB2E.getB2EUserDetails.nit,
                telephone: userB2E.getB2EUserDetails.celular,
                street: address.direccion,
                reference: address.televendedor,
                city: titleCase(address.ciudad),
                latitude: address.latitud,
                longitude: address.longitud,
                billing: 0,
                id_price_list: address.id_listaPrecio,
                id_address_ebs: address.id_direccion,
              },
            });
          })
        );
        // update and set b2e as default address
        getUserDetails();
        setError(NoError);
        setState(ActivateState.ModifyAddress);
      }
    } catch (error) {
      if (sms) {
        setState(ActivateState.WritePin);
        setError(InvalidPin);
      } else {
        setState(ActivateState.InsertEmployeeCode);
        setError("Error en la activación de tu cuenta.")
      }
    }
  };

  const handleModifyAddress = async () => {
    setState(ActivateState.Loading);
    try {
      await updateB2EAddress({
        variables: {
          Id_Cliente: userDetails?.details.employee,
          Id_Direccion: idAddress,
          Direccion: street,
          Ciudad: city,
          Telefono: phone,
          Latitud: latitude,
          Longitud: longitude,
        },
      });
      await addAddress({
        variables: {
          ...address,
          addressId: address.id,
          street,
          phone,
          latitude,
          longitude,
          billing: 0,
        },
      });
      const fields = {
        defaultAddressId: address?.id,
        defaultAddressLabel: street,
        cityKey: findKeyByCity(address?.city as string) || "SC",
        cityName: address?.city,
        agency: null,
        idPriceList: address?.id_price_list || 0,
      };
      await updateMainAddress({
        variables: {
          user: {
            ...fields,
          },
        },
      });
    } catch (e) {
      console.error(e);
    }
    setState(ActivateState.Congrats);
  };

  const goToMyAccount = () => {
    history.push("/mi-cuenta");
  };

  const goToProducts = () => {
    history.push("/productos");
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {state === ActivateState.Loading ? <Loading /> : null}
      {state === ActivateState.Benefits ? <Benefits onBack={() => setState(ActivateState.Benefits)} onNext={() => handleStart()} isEmployee={idPriceList > 0} error={error} /> : null}
      {state === ActivateState.InsertNit ? <InsertNit onBack={() => setState(ActivateState.Benefits)} onNext={() => handleSetNit()} error={error} setNit={setNit} nit={nit} /> : null}
      {state === ActivateState.ValidateOptions ? <ValidateOptions onBack={() => setState(ActivateState.InsertNit)} onNext={handleOptionsNext} phone={phone} /> : null}
      {state === ActivateState.InsertEmployeeCode ? <InsertEmployeeCode onBack={() => setState(ActivateState.ValidateOptions)} onNext={handleEmployeeCode} error={error}/> : null}
      {state === ActivateState.ConfirmPhone ? <ConfirmPhone onBack={() => setState(ActivateState.ValidateOptions)} onNext={() => handleConfirm()} error={error} name={name} phone={phone}/> : null}
      {state === ActivateState.WritePin ? (
        <WritePin onBack={() => setState(ActivateState.ConfirmPhone)} onNext={() => handleVerify(true)} error={error} phone={phone} token={token} setToken={setToken} />
      ) : null}
      {state === ActivateState.ModifyAddress ? (
        <ModifyAddress
          onBack={() => setState(ActivateState.WritePin)}
          onNext={() => handleModifyAddress()}
          error={error}
          street={street}
          setStreet={setStreet}
          city={city}
          phone={phone}
          setPhone={setPhone}
          latitude={latitude}
          setLatitude={setLatitude}
          longitude={longitude}
          setLongitude={setLongitude}
        />
      ) : null}
      {state === ActivateState.Congrats ? <Congrats onBack={() => goToProducts()} onNext={() => goToMyAccount()} error={error} /> : null}
    </Suspense>
  );
};

export default Activate;