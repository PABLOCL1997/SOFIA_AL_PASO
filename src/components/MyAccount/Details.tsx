import React, { FC, useState, Suspense, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { BREAKPOINT } from "../../utils/constants";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { GET_USER, DETAILS } from "../../graphql/user/queries";
import { cities, KeyValue } from "../../utils/string";
import { useMutation } from "react-apollo";
import {
  SET_USER,
  ADD_ADDRESS,
  REMOVE_ADDRESS
} from "../../graphql/user/mutations";
import { UserType, AddressType } from "../../graphql/user/type";
import { setLatLng } from "../../utils/googlemaps";

const Loader = React.lazy(() =>
  import(/* webpackChunkName: "Loader" */ "../Loader")
);
const Pencil = React.lazy(() =>
  import(/* webpackChunkName: "Pencil" */ "../Images/Pencil")
);
const Delete = React.lazy(() =>
  import(/* webpackChunkName: "Delete" */ "../Images/Delete")
);
const Close = React.lazy(() =>
  import(/* webpackChunkName: "Close" */ "../Images/Close")
);
const Map = React.lazy(() => import(/* webpackChunkName: "Map" */ "../Map"));
const Cta = React.lazy(() => import(/* webpackChunkName: "Cta" */ "../Cta"));
const Chevron = React.lazy(() =>
  import(/* webpackChunkName: "Chevron" */ "../Images/Chevron")
);

const Title = styled.div`
  display: flex;
  align-items: center;
  h1 {
    font-family: MullerMedium;
    font-size: 24px;
    line-height: 24px;
    letter-spacing: 0.01em;
    color: var(--black);
    flex: 1;
  }
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  span {
    font-family: MullerMedium;
    font-size: 12px;
    line-height: 12px;
    color: var(--red);
    margin-left: 10px;
  }
  &:hover {
    opacity: 0.8;
  }
`;

const SectionTitle = styled.h2`
  font-family: MullerMedium;
  font-size: 16px;
  line-height: 16px;
  letter-spacing: 0.01em;
  color: var(--red);
  margin: 32px 0;
`;

const FormWrapper = styled.div``;

const AddressWrapper = styled.div``;

const AddressRow = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--m-gray);
  padding: 15px 0;
  &:last-child {
    border-bottom: 0;
  }
`;

const Street = styled.div`
  flex: 1;
`;

const DeleteWrapper = styled.div`
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

const Form = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 24px;
  row-gap: 30px;
  @media screen and (max-width: ${BREAKPOINT}) {
    grid-template-columns: 1fr;
    column-gap: 0;
  }
`;

const InputGroup = styled.div<{ key?: string }>`
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
  }
`;

const NewAddress = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding-top: 10px;
  button {
    font-family: MullerMedium;
    font-size: 14px;
    line-height: 14px;
    text-decoration: underline;
    color: var(--red);
    background: none;
    border: 0;
    &:hover {
      opacity: 0.8;
    }
  }
`;

const ModalCourtain = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  z-index: 10;
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 25px;
  &.visible {
    display: flex;
  }
  @media screen and (max-width: ${BREAKPOINT}) {
    padding-bottom: 0;
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
  min-width: 750px;
  max-width: 100%;
  @media screen and (max-width: ${BREAKPOINT}) {
    min-width: 100%;
    height: 100vh;
    border-radius: 0;
  }
`;

const CloseWrapper = styled.div`
  cursor: pointer;
  svg {
    margin-top: 4px;
    margin-left: 30px;
    path {
      stroke: var(--red);
    }
  }
  &:hover {
    opacity: 0.8;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  width: calc(100% + 84px);
  padding: 30px;
  margin-top: -42px;
  box-shadow: 0px 6px 74px rgba(0, 0, 0, 0.1);
  @media screen and (max-width: ${BREAKPOINT}) {
    padding: 15px 30px;
  }
`;

const HeaderTitle = styled.h2`
  font-family: MullerMedium;
  font-size: 24px;
  line-height: 24px;
  color: var(--black);
  flex: 1;
  @media screen and (max-width: ${BREAKPOINT}) {
    font-size: 14px;
    line-height: 14px;
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

const ModalContainer = styled.div`
  padding: 30px 0;
  width: 100%;
  max-height: calc(100vh - 300px);
  overflow: auto;
  @media screen and (max-width: ${BREAKPOINT}) {
    max-height: calc(100vh - 100px);
  }
`;

const CtaWrapper = styled.div`
  button {
    padding: 10px 50px;
    margin-top: 30px;
  }
  img {
    margin: 30px auto 0;
    display: block;
  }
`;

const LoaderWrapper = styled.div`
  img {
    width: 20px;
  }
`;

const LoaderWrapperBig = styled.div`
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 50px;
  }
`;

type Props = {};

type AddressArgs = {
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
  on: boolean;
};

const Details: FC<Props> = () => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [inputs, setInputs] = useState<UserType>({ addresses: [] });
  const [addressInputs, setAddressInputs] = useState<AddressType>({});
  const [addressArgs, setAddressArgs] = useState<AddressArgs>({ on: false });
  const [addressId, setAddressId] = useState(0);
  const [showError] = useMutation(SET_USER, {
    variables: { user: { showError: t("account.error") } }
  });
  const [showSuccess] = useMutation(SET_USER, {
    variables: { user: { showSuccess: t("account.success") } }
  });

  const { data: userData } = useQuery(GET_USER, {});
  const [getDetails, { loading: userLoading }] = useLazyQuery(DETAILS, {
    fetchPolicy: "network-only",
    onCompleted: d => {
      setInputs(d.details);
    }
  });
  const [deleteAddress] = useMutation(REMOVE_ADDRESS, {
    variables: { addressId }
  });
  const [handleAddress] = useMutation(ADD_ADDRESS, { variables: addressArgs });
  const [toggleAddressModal] = useMutation(SET_USER, {
    variables: { user: { openAddressModal: true } }
  });
  const [closeAddressModal] = useMutation(SET_USER, {
    variables: { user: { openAddressModal: false } }
  });

  const onChange = (key: string, value: string) => {
    setInputs({
      ...inputs,
      [key]: value
    });
  };

  const onChangeAddress = (key: string, value: string) => {
    setAddressInputs({
      ...addressInputs,
      [key]: value
    });
    console.log(key, value);
    if (key === "city" && value) setLatLng(String(value));
  };

  const removeAddress = (address: AddressType) => {
    setAddressId(address.id || 0);
  };

  const addAddress = () => {
    if (!addressInputs.street)
      return showError({
        variables: { user: { showError: t("account.empty_street") } }
      });
    if (!addressInputs.reference)
      return showError({
        variables: { user: { showError: t("account.empty_reference") } }
      });
    if (!addressInputs.city)
      return showError({
        variables: { user: { showError: t("account.empty_city") } }
      });
    setAddressArgs({
      addressId: 0,
      firstname: inputs.firstname,
      lastname: inputs.lastname,
      email: inputs.email,
      nit: inputs.nit,
      telephone: inputs.phone,
      password: "",
      street: addressInputs.street,
      reference: addressInputs.reference,
      city: addressInputs.city,
      latitude: String((window as any).latitude),
      longitude: String((window as any).longitude),
      billing: 0,
      on: true
    });
  };

  const edit = () => {
    setEditMode(false);
    setAddressArgs({
      addressId: inputs.addressId || 0,
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
      billing: 1,
      on: true
    });
  };

  const callAddressMutation = async () => {
    try {
      setLoading(true);
      await handleAddress();
      setAddressArgs({ on: false });
      setAddressInputs({});
      closeAddressModal();
      getDetails();
      showSuccess();
    } catch (e) {
      showError();
    }
    setLoading(false);
  };

  const callDeleteMutation = async () => {
    try {
      await deleteAddress();
      setAddressId(0);
      getDetails();
      showSuccess();
    } catch (e) {
      showError();
    }
  };

  useEffect(() => {
    if (addressId > 0) callDeleteMutation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressId]);

  useEffect(() => {
    if (addressArgs && addressArgs.on) callAddressMutation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressArgs]);

  useEffect(() => {
    closeAddressModal();
    getDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options: { [key: string]: Array<string> } = {
    city: cities.map((c: KeyValue) => c.value)
  };

  return (
    <Suspense fallback={<Loader />}>
      <>
        <Title>
          <h1>{t("account.title")}</h1>
          {loading && (
            <LoaderWrapper>
              <img src="/images/loader.svg" alt="loader" />
            </LoaderWrapper>
          )}
          {!loading && !editMode && (
            <Button onClick={() => setEditMode(true)}>
              <Pencil />
              <span>{t("account.edit")}</span>
            </Button>
          )}
          {!loading && editMode && (
            <Button onClick={edit}>
              <span>{t("account.save")}</span>
            </Button>
          )}
        </Title>
        {userLoading && !inputs.email && (
          <LoaderWrapperBig>
            <img src="/images/loader.svg" alt="loader" />
          </LoaderWrapperBig>
        )}
        {!userLoading && inputs.email && (
          <FormWrapper>
            <SectionTitle>{t("account.data")}</SectionTitle>
            <Form>
              {[
                "firstname",
                "lastname",
                "email",
                "nit",
                "phone",
                "password"
              ].map((key: string) => (
                <InputGroup key={key}>
                  <label>{t("account." + key)}</label>
                  <input
                    readOnly={key === "email" || (key !== "key" && !editMode)}
                    value={(inputs as any)[key] || ""}
                    onChange={evt => onChange(key, evt.target.value)}
                    pattern={key === "phone" || key === "nit" ? "[0-9]*" : ""}
                    type={
                      key === "phone" || key === "nit"
                        ? "number"
                        : key === "password"
                        ? "password"
                        : "text"
                    }
                    placeholder={t("account." + key)}
                  />
                </InputGroup>
              ))}
            </Form>
          </FormWrapper>
        )}
        {!userLoading && (
          <AddressWrapper>
            <SectionTitle>{t("account.addresses")}</SectionTitle>
            {inputs.addresses &&
              inputs.addresses.map((address: AddressType) => (
                <AddressRow key={address.id}>
                  <Street>{address.street}</Street>
                  <DeleteWrapper onClick={() => removeAddress(address)}>
                    <Delete />
                  </DeleteWrapper>
                </AddressRow>
              ))}
          </AddressWrapper>
        )}
        {!userLoading && (
          <NewAddress>
            <button onClick={() => toggleAddressModal()}>
              {t("account.newaddress")}
            </button>
          </NewAddress>
        )}
        <ModalCourtain
          className={
            userData.userInfo.length &&
            userData.userInfo[0].openAddressModal &&
            "visible"
          }
        >
          <Modal>
            <Header>
              <HeaderTitle>{t("account.modal.title")}</HeaderTitle>
              <CloseWrapper onClick={() => closeAddressModal()}>
                <Close />
              </CloseWrapper>
            </Header>
            <ModalContainer>
              <Form>
                <InputGroup>
                  <input
                    value={addressInputs.street || ""}
                    onChange={evt =>
                      onChangeAddress("street", evt.target.value)
                    }
                    type={"text"}
                    placeholder={t("account.modal.street")}
                  />
                </InputGroup>
                <SelectWrapper>
                  <select
                    value={addressInputs.city || ""}
                    onChange={evt => onChangeAddress("city", evt.target.value)}
                  >
                    <option value="">{t("checkout.delivery.city")}</option>
                    {options.city.map((opt: string) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                  <Chevron />
                </SelectWrapper>
                <InputGroup>
                  <input
                    value={addressInputs.reference || ""}
                    onChange={evt =>
                      onChangeAddress("reference", evt.target.value)
                    }
                    type={"text"}
                    placeholder={t("account.modal.reference")}
                  />
                </InputGroup>
              </Form>
              {userData.userInfo.length &&
                userData.userInfo[0].openAddressModal && <Map />}
              <CtaWrapper>
                {!loading && (
                  <Cta
                    filled={true}
                    text={t("account.modal.add")}
                    action={addAddress}
                  />
                )}
                {loading && (
                  <LoaderWrapper>
                    <img src="/images/loader.svg" alt="loader" />
                  </LoaderWrapper>
                )}
              </CtaWrapper>
            </ModalContainer>
          </Modal>
        </ModalCourtain>
      </>
    </Suspense>
  );
};

export default Details;
