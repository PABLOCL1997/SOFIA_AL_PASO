import React, { Suspense, FC, useState, useEffect } from "react";
import { Wrapper, Headline, EditButton } from "./style";

import EditIcon from "../../../../assets/images/edit-icon.svg";
import { OperationVariables, useMutation } from "react-apollo";
import { QueryLazyOptions } from "@apollo/react-hooks";
import { ADD_ADDRESS, SET_USER } from "../../../../graphql/user/mutations";
import { useTranslation } from "react-i18next";
import { AddressType, UserType } from "../../../../graphql/user/type";
import { InputGroup, InputsWrapper, LoaderWrapperBig } from "../style";

type Props = {
  userData: any;
  userDetails: {
    getDetails: (options?: QueryLazyOptions<OperationVariables> | undefined) => void;
    details: UserType;
    loading: boolean;
  };
};

export type AddressArgs = {
  addressId?: Number;
  firstname?: string;
  lastname?: string;
  email?: string;
  nit?: string;
  telephone?: string;
  password?: string;
  street?: string;
  reference?: string;
  city?: string;
  latitude?: string;
  longitude?: string;
  billing?: Number;
  id_price_list?: string;
  id_address_ebs?: string;
  on: boolean;
};

const CardAccount: FC<Props> = ({ userData, userDetails }) => {
  const billing = 1; // on this card we only modify billing info
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [inputs, setInputs] = useState<UserType>({ addresses: [] });
  const [addressArgs, setAddressArgs] = useState<AddressArgs>({ on: false });

  const [showError] = useMutation(SET_USER, { variables: { user: { showError: t("account.error") } } });
  const [handleAddress] = useMutation(ADD_ADDRESS, { variables: addressArgs });

  const onChange = (key: string, value: string) => setInputs({ ...inputs, [key]: value });

  const editBilling = () => {
    setEditMode(false);
    setLoading(true);
    let addressId = inputs?.addressId || 0;

    if (inputs?.addresses?.length) addressId = inputs.addresses.find((address: AddressType) => address.id === inputs.addressId)?.id ?? addressId;
    // check if address id exists in the list of addresses
    if (inputs?.addresses?.length && inputs.addresses.find((address: AddressType) => address.id === addressId)) addressId = 0;

    setAddressArgs({
      addressId,
      firstname: inputs.firstname,
      lastname: inputs.lastname,
      email: inputs.email,
      nit: inputs.nit,
      telephone: inputs.phone,
      password: inputs.password,
      street: "",
      reference: "",
      city: userData.userInfo.length ? userData.userInfo[0].cityName : "",
      latitude: "",
      longitude: "",
      billing,
      on: true,
    });
  };

  const callAddressMutation = async () => {
    try {
      setLoading(true);
      await handleAddress();
      setAddressArgs({ on: false });
      userDetails.getDetails();
    } catch (e) {
      showError();
    }
    setLoading(false);
  };

  useEffect(() => userDetails?.details && setInputs(userDetails.details), [userDetails]);

  useEffect(() => void (addressArgs && addressArgs.on && callAddressMutation()), [addressArgs]); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Suspense fallback={<div></div>}>
      <Wrapper>
        <Headline>
          <h4>{t("account.data")}</h4>

          {editMode && (
            <EditButton onClick={editBilling}>
              <span>{t("account.save")}</span>
            </EditButton>
          )}
          {loading && (
            <EditButton>
              <span>Guardando...</span>
            </EditButton>
          )}
          {!editMode && !loading && (
            <EditButton onClick={() => setEditMode(true)}>
              <img src={EditIcon} alt="Edit" />
              <span>Editar</span>
            </EditButton>
          )}
        </Headline>
        {userDetails.loading && !inputs.email && (
          <LoaderWrapperBig>
            <img src="/images/loader.svg" width="50px" height="50px" alt="loader" />
          </LoaderWrapperBig>
        )}

        {!userDetails.loading && inputs.email && (
          <InputsWrapper>
            {["firstname", "lastname", "email", "nit", "phone", "password"].map((key: string) => (
              <InputGroup key={key}>
                <label>{t("account." + key)}</label>
                <input
                  readOnly={key === "email" || (key !== "key" && !editMode)}
                  value={(inputs as any)[key] || ""}
                  onChange={(evt) => onChange(key, evt.target.value)}
                  pattern={key === "phone" || key === "nit" ? "[0-9]*" : ""}
                  type={key === "phone" || key === "nit" ? "number" : key === "password" ? "password" : "text"}
                  placeholder={t("account." + key)}
                  disabled={!editMode}
                />
              </InputGroup>
            ))}
          </InputsWrapper>
        )}
      </Wrapper>
    </Suspense>
  );
};

export default CardAccount;
