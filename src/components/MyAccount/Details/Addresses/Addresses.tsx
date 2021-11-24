import React, { Suspense, FC, useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { OperationVariables, useMutation } from "react-apollo";
import { QueryLazyOptions } from "@apollo/react-hooks";
import { AddressType, UserType } from "../../../../graphql/user/type";
import { ADD_ADDRESS, REMOVE_ADDRESS, SET_USER, UPDATE_B2E_ADDRESS } from "../../../../graphql/user/mutations";
import { setLatLng } from "../../../../utils/googlemaps";
import { cities, KeyValue } from "../../../../utils/string";
import { DesktopAndTablet, MobileAndTablet } from "../../../ResponsiveContainers";
import Cta from "../../../Cta";
import Map from "../../../Map";
import { AddressArgs } from "../CardAccount/CardAccount";
import * as SC from "./style";

import ArrowLeft from "../../../../assets/images/arrow.svg";
import StarIcon from "../../../../assets/images/star.svg";

const Delete = React.lazy(() => import(/* webpackChunkName: "Delete" */ "../../../Images/Delete"));
const Close = React.lazy(() => import(/* webpackChunkName: "Close" */ "../../../Images/Close"));
const Chevron = React.lazy(() => import(/* webpackChunkName: "Chevron" */ "../../../Images/Chevron"));
const Switch = React.lazy(() => import(/* webpackChunkName: "Switch" */ "../../../Switch"));

const emptyCSS = {} as React.CSSProperties;
const gridSpan2CSS = { gridColumn: "1 / span 2" } as React.CSSProperties;
const bold = { fontWeight: "bold" } as React.CSSProperties;

type Props = {
  userData?: any;
  userDetails: {
    getDetails: (options?: QueryLazyOptions<OperationVariables> | undefined) => void;
    details: UserType;
    loading: boolean;
  };
};
const Addresses: FC<Props> = ({ userData, userDetails }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const myRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [mapUsed, setMapUsed] = useState(false);
  const [activeScroll, setActiveScroll] = useState(-1);
  const [currentPage, setCurrentPage] = useState(0);
  const [savedIndex, setSavedIndex] = useState(1);
  const [inputs, setInputs] = useState<UserType>({ addresses: [] });
  const [addressArgs, setAddressArgs] = useState<AddressArgs>({ on: false });
  const [addressInputs, setAddressInputs] = useState<any>({ addressType: t("checkout.delivery.street") });
  const [addressId, setAddressId] = useState(0);
  const [dataEditable, setDataEditable] = useState<any>([]);

  const [deleteAddress] = useMutation(REMOVE_ADDRESS, { variables: { addressId } });
  const [toggleAddressModal] = useMutation(SET_USER, { variables: { user: { openAddressModal: true } } });
  const [showError] = useMutation(SET_USER, { variables: { user: { showError: t("account.error") } } });
  const [closeAddressModal] = useMutation(SET_USER, { variables: { user: { openAddressModal: false } } });
  const [setUser] = useMutation(SET_USER, {});
  const [updateB2EAddress] = useMutation(UPDATE_B2E_ADDRESS);
  const [handleAddress] = useMutation(ADD_ADDRESS, { variables: addressArgs });

  const options: { [key: string]: Array<string> } = { city: cities.map((c: KeyValue) => c.value), home_type: ["Casa", "Departamento"] };
  const addressTypes = [
    { title: t("checkout.delivery.street"), value: t("checkout.delivery.street") },
    { title: t("checkout.delivery.avenue"), value: t("checkout.delivery.avenue") },
  ];
  const limitPerPage = 4;
  let pages: any = 0;

  if (dataEditable.length > 0) pages = Math.ceil(dataEditable.length / limitPerPage);

  const scrollToRef = (ref: any) => window.scrollTo({ top: ref.current.offsetTop, behavior: "smooth" });

  const validate = () => {
    let missingField = false;

    if (!mapUsed && !addressInputs.id) {
      window.scrollTo({ top: (document as any).getElementById("gmap").getBoundingClientRect().top + (window as any).scrollY - 170, behavior: "smooth" });
      showError({ variables: { user: { showError: t("checkout.move_map") } } });
      return false;
    }

    let fields = addressInputs?.id_address_ebs ? ["phone", "address", "city"] : ["firstname", "lastname", "phone", "city", "address", "reference"];

    fields.forEach((key: string) => {
      if ((!addressInputs[key] || !addressInputs[key].trim()) && !missingField) {
        if (key === "building_name" && addressInputs.home_type === "Casa") return;
        missingField = true;
        const input = document.querySelector(`[name="shipping-${key}"]`);
        if (input) {
          input.classList.add("error");
          (document as any).getElementById("new-address-modal").scrollTo({ top: (input as any).offsetTop - 170, behavior: "smooth" });
        }
        showError({ variables: { user: { showError: t("checkout.missing_field", { field: t("checkout.delivery." + key) }) } } });
      }
    });

    return !missingField;
  };

  const removeAddress = (address: AddressType) => setAddressId(address.id || 0);

  const onChangeAddress = (key: string, value: string) => {
    setAddressInputs({ ...addressInputs, [key]: value });
    if (key === "city" && value) setLatLng(String(value));
  };

  const editAddress = async () => {
    setLoading(true);
    if (!validate()) return;
    if (userData.userInfo.length && userData.userInfo[0] && addressInputs.id === userData.userInfo[0].defaultAddressId) {
      setUser({
        variables: {
          user: { defaultAddressLabel: `${addressInputs.street}` },
        },
      });
    }
    setAddressArgs({
      addressId: addressInputs.id,
      firstname: addressInputs.firstname,
      lastname: addressInputs.lastname,
      email: inputs.email,
      nit: addressInputs.nit,
      telephone: `${addressInputs.phone} | ${addressInputs.phone2}`,
      password: "",
      street: addressInputs.address,
      reference: addressInputs.reference,
      city: addressInputs.city,
      latitude: String((window as any).latitude),
      longitude: String((window as any).longitude),
      billing: 0,
      id_price_list: addressInputs.id_price_list,
      id_address_ebs: addressInputs.id_address_ebs,
      on: true,
    });
    if (addressInputs?.id_address_ebs) {
      await updateB2EAddress({
        variables: {
          Id_Cliente: userDetails?.details.employee,
          Id_Direccion: addressInputs?.id_address_ebs,
          Direccion: addressInputs.address,
          Ciudad: addressInputs.city,
          Telefono: addressInputs.phone,
          Latitud: String((window as any).latitude),
          Longitud: String((window as any).longitude),
        },
      });
    }
    setLoading(false);
  };

  const addAddress = () => {
    if (!validate()) return;

    setAddressArgs({
      addressId: 0,
      firstname: addressInputs.firstname,
      lastname: addressInputs.lastname,
      email: inputs.email,
      nit: addressInputs.nit,
      telephone: `${addressInputs.phone} | ${addressInputs.phone2}`,
      password: "",
      street: addressInputs.address,
      reference: addressInputs.reference,
      city: addressInputs.city,
      latitude: String((window as any).latitude),
      longitude: String((window as any).longitude),
      billing: 0,
      on: true,
    });
  };

  const openEditModal = (address: AddressType) => {
    let street: Array<string> = [];
    let phone: Array<string> = [];
    if (address.street) street = address.street.split(" | ");
    if (address.phone) phone = address.phone.split(" | ");
    toggleAddressModal();
    setAddressInputs({
      ...addressInputs,
      ...address,
      address: street[0] || "",
      number: street[1] || "",
      home_type: street[2] || "",
      apt_number: street[3] || "",
      building_name: street[4] || "",
      zone: street[5] || "",
      neighborhood: street[6] || "",
      phone: phone[0] || "",
      phone2: phone[1] || "",
    });
    let i = setInterval(() => {
      if ((window as any).map) {
        clearInterval(i);
        if (address.latitude && address.latitude !== "") setLatLng("", address.latitude, address.longitude);
        else setLatLng(address.city || "");
      }
    }, 10);
  };

  const callDeleteMutation = async () => {
    try {
      await deleteAddress();
      setAddressId(0);
      userDetails.getDetails();
    } catch (e) {
      showError();
    }
  };

  useEffect(() => ((window as any).updateMapUsed = () => setMapUsed(true)), []);

  const callAddressMutation = async () => {
    try {
      setLoading(true);
      await handleAddress();
      setAddressArgs({ on: false });
      setAddressInputs({});
      closeAddressModal();
      userDetails.getDetails();
    } catch (e) {
      showError();
    }
    setLoading(false);
  };

  useEffect(() => void (addressArgs && addressArgs.on && callAddressMutation()), [addressArgs]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setCurrentPage(0);
    if (!userDetails.details) return;
    setInputs(userDetails.details);
    setDataEditable(
      userDetails.details.addresses?.map((address: any) => {
        const { alias, id_direccion, latitud, longitud, ciudad, provincia, vendedor, direccion, categoriaCliente, vhPrimerTurno, vhSegundoTurno } = address;
        return {
          id_direccion,
          nombreDireccion: alias || "",
          ciudad,
          provincia,
          vendedor,
          direccionDeNegocio: direccion,
          categoriaDeCliente: categoriaCliente,
          ventanaHorariaTemprana: vhPrimerTurno,
          ventanaHorariaTarde: vhSegundoTurno,
          googleMaps: { lat: parseFloat(latitud), lng: parseFloat(longitud) },
        };
      })
    );
  }, [userDetails]);

  useEffect(() => {
    if (activeScroll !== -1) {
      scrollToRef(myRef);
      setTimeout(() => {
        setActiveScroll(-1);
      }, 300);
    }
  }, [activeScroll]);

  useEffect(() => {
    if (location.search === "?na") {
      window.history.pushState("", document.title, "/mi-cuenta");
      setTimeout(() => toggleAddressModal(), 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => void (addressId > 0 && callDeleteMutation()), [addressId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Suspense fallback={<div></div>}>
      <SC.Wrapper>
        <h4>{t("account.addresses")}</h4>
        <SC.Anchor ref={myRef}></SC.Anchor>
        <DesktopAndTablet>
          <SC.FirstList>
            {inputs.addresses &&
              inputs.addresses.slice(currentPage, currentPage + limitPerPage).map((address: AddressType) => (
                <SC.AddressRow key={address.id}>
                  <SC.Street onClick={() => openEditModal(address)}>
                    <SC.StreetSpan>
                      <span title={address.street?.replace(/ \| /g, " ")} style={userData.userInfo[0].defaultAddressId === address.id ? bold : emptyCSS}>
                        {" "}
                        {address.street?.replace(/ \| /g, " ")}
                      </span>
                      {address?.id_price_list ? (
                        <SC.StarWrap>
                          <img src={StarIcon} alt="" />
                          <SC.TooltipStar>{t("account.tooltip_star_msg")}</SC.TooltipStar>
                        </SC.StarWrap>
                      ) : (
                        ""
                      )}
                    </SC.StreetSpan>
                  </SC.Street>
                  {address?.id_price_list ? (
                    ""
                  ) : (
                    <SC.DeleteWrapper onClick={() => removeAddress(address)}>
                      <Delete />
                    </SC.DeleteWrapper>
                  )}
                </SC.AddressRow>
              ))}
            {!userDetails.loading && (
              <SC.NewAddress>
                <button onClick={() => toggleAddressModal()}>{t("account.newaddress")}</button>
              </SC.NewAddress>
            )}
          </SC.FirstList>
          {pages > 1 && (
            <SC.Paginator>
              <ul>
                {currentPage <= 1 ? (
                  <div>
                    <SC.ArrowPrev disable={currentPage <= 1} src={ArrowLeft} alt="prev" />
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      setSavedIndex(savedIndex - 1);
                      setCurrentPage(currentPage - limitPerPage);
                    }}
                  >
                    <SC.ArrowPrev disable={currentPage <= 1} src={ArrowLeft} alt="prev" />
                  </div>
                )}

                <>
                  {[...Array(pages)].map((_, i) => {
                    return (
                      <SC.Li
                        onClick={() => {
                          setCurrentPage(i * limitPerPage);
                          setSavedIndex(i + 1);
                        }}
                        key={i + 1}
                        index={i * limitPerPage}
                        current={currentPage}
                      >
                        {i + 1}
                      </SC.Li>
                    );
                  })}
                </>

                {savedIndex === pages ? (
                  <div>
                    <SC.ArrowNext disable={savedIndex === pages} src={ArrowLeft} alt="next" />
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      setSavedIndex(savedIndex + 1);
                      setCurrentPage(currentPage + limitPerPage);
                    }}
                  >
                    <SC.ArrowNext disable={savedIndex === pages} src={ArrowLeft} alt="next" />
                  </div>
                )}
              </ul>
            </SC.Paginator>
          )}
        </DesktopAndTablet>
        <MobileAndTablet>
          <SC.FirstList>
            {inputs.addresses &&
              inputs.addresses.slice(currentPage, currentPage + limitPerPage).map((address: AddressType) => (
                <SC.AddressRow key={address.id}>
                  <SC.Street onClick={() => openEditModal(address)}>
                    <SC.StreetSpan>
                      <span title={address.street?.replace(/ \| /g, " ")} style={userData.userInfo[0].defaultAddressId === address.id ? bold : emptyCSS}>
                        {" "}
                        {address.street?.replace(/ \| /g, " ")}
                      </span>
                      {address?.id_price_list ? (
                        <SC.StarWrap>
                          <img src={StarIcon} alt="" />
                          <SC.TooltipStar>{t("account.tooltip_star_msg")}</SC.TooltipStar>
                        </SC.StarWrap>
                      ) : (
                        ""
                      )}
                    </SC.StreetSpan>
                  </SC.Street>
                  {address?.id_price_list ? (
                    ""
                  ) : (
                    <SC.DeleteWrapper onClick={() => removeAddress(address)}>
                      <Delete />
                    </SC.DeleteWrapper>
                  )}
                </SC.AddressRow>
              ))}
            {!userDetails.loading && (
              <SC.NewAddress>
                <button onClick={() => toggleAddressModal()}>{t("account.newaddress")}</button>
              </SC.NewAddress>
            )}
          </SC.FirstList>
          {pages > 1 && (
            <SC.Paginator>
              <ul>
                {currentPage <= 1 ? (
                  <div>
                    <SC.ArrowPrev disable={currentPage <= 1} src={ArrowLeft} alt="prev" />
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      setSavedIndex(savedIndex - 1);
                      setCurrentPage(currentPage - limitPerPage);
                    }}
                  >
                    <SC.ArrowPrev disable={currentPage <= 1} src={ArrowLeft} alt="prev" />
                  </div>
                )}

                <>
                  {[...Array(pages)].map((_, i) => {
                    return (
                      <SC.Li
                        onClick={() => {
                          setCurrentPage(i * limitPerPage);
                          setSavedIndex(i + 1);
                        }}
                        key={i + 1}
                        index={i * limitPerPage}
                        current={currentPage}
                      >
                        {i + 1}
                      </SC.Li>
                    );
                  })}
                </>

                {savedIndex === pages ? (
                  <div>
                    <SC.ArrowNext disable={savedIndex === pages} src={ArrowLeft} alt="next" />
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      setSavedIndex(savedIndex + 1);
                      setCurrentPage(currentPage + limitPerPage);
                    }}
                  >
                    <SC.ArrowNext disable={savedIndex === pages} src={ArrowLeft} alt="next" />
                  </div>
                )}
              </ul>
            </SC.Paginator>
          )}
        </MobileAndTablet>
        <SC.ModalCourtain className={userData.userInfo.length && userData.userInfo[0].openAddressModal && "visible"}>
          <SC.Modal>
            <SC.Header>
              <SC.HeaderTitle>{addressInputs.id ? t("account.modal.edit_title") : t("account.modal.title")}</SC.HeaderTitle>
              <SC.CloseWrapper onClick={() => closeAddressModal()}>
                <Close />
              </SC.CloseWrapper>
            </SC.Header>
            <SC.ModalContainer id="new-address-modal">
              <SC.Form>
                {(addressInputs && addressInputs?.id_address_ebs ? ["phone", "address", "city"] : ["firstname", "lastname", "phone", "phone2", "city", "address", "reference"]).map((key: string) => {
                  return (
                    <SC.InputGroup withLabel={key !== "street"} key={key} style={key === "reference" ? gridSpan2CSS : emptyCSS}>
                      <label>{t("checkout.delivery." + key)}</label>
                      {options[key] && (
                        <SC.SelectWrapper>
                          <select name={`shipping-${key}`} onChange={(evt) => onChangeAddress(key, evt.target.value)} value={addressInputs[key] || ""} disabled={addressInputs?.id_address_ebs}>
                            <option value="">{t("checkout.delivery." + key)}</option>
                            {options[key].map((opt: string) => (
                              <option key={opt}>{opt}</option>
                            ))}
                          </select>
                          {!addressInputs?.id_address_ebs && <Chevron />}
                        </SC.SelectWrapper>
                      )}
                      {(key === "address" || key === "reference") && (
                        <input
                          name={`shipping-${key}`}
                          value={addressInputs[key] || ""}
                          onChange={(evt) => onChangeAddress(key, evt.target.value)}
                          type="text"
                          placeholder={t("checkout.delivery." + key + "_ph")}
                        />
                      )}
                      {key === "street" && <Switch changeOption={(value: string) => onChangeAddress("addressType", value)} option={addressInputs.addressType} values={addressTypes} />}
                      {key !== "street" && key !== "address" && key !== "reference" && !options[key] && (
                        <input
                          name={`shipping-${key}`}
                          value={addressInputs[key] || ""}
                          onChange={(evt) => onChangeAddress(key, evt.target.value)}
                          pattern={key.indexOf("phone") >= 0 || key === "nit" ? "[0-9]*" : ""}
                          type={key.indexOf("phone") >= 0 || key === "nit" ? "number" : "text"}
                          placeholder={t("checkout.delivery." + key)}
                        />
                      )}
                    </SC.InputGroup>
                  );
                })}
              </SC.Form>
              {userData.userInfo.length && userData.userInfo[0].openAddressModal && <Map />}
              <SC.CtaWrapper>
                {!loading && addressInputs.id && <Cta filled={true} text={t("account.modal.edit_title")} action={editAddress} />}
                {!loading && !addressInputs.id && <Cta filled={true} text={t("account.modal.add")} action={addAddress} />}
                {loading && (
                  <SC.LoaderWrapper>
                    <img src="/images/loader.svg" width="50px" height="50px" alt="loader" />
                  </SC.LoaderWrapper>
                )}
              </SC.CtaWrapper>
            </SC.ModalContainer>
          </SC.Modal>
        </SC.ModalCourtain>
      </SC.Wrapper>
    </Suspense>
  );
};

export default Addresses;
