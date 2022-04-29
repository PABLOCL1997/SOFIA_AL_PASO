import React, { FC, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { setLatLng } from "../../../../utils/googlemaps";
import { cities } from "../../../../utils/string";
import Cta from "../../../Cta";
import Map from "../../../Map";
import * as SC from "./style";

import ArrowLeft from "../../../../assets/images/arrow.svg";
import StarIcon from "../../../../assets/images/star.svg";
import EditIcon from "../../../../assets/images/edit-icon.svg";
import useAddress, { AddressEdit, Addresses as listAddresses } from "../../../../hooks/useAddress";
import useUser from "../../../../hooks/useUser";
import { rangeArray } from "../../../../utils/dataTransform";

const Delete = React.lazy(() => import(/* webpackChunkName: "Delete" */ "../../../Images/Delete"));
const Close = React.lazy(() => import(/* webpackChunkName: "Close" */ "../../../Images/Close"));

interface PropsTable {
  setType: React.Dispatch<React.SetStateAction<typeModal>>;
  listAddresses: listAddresses[];
  handleAddressModal: (value: boolean) => void;
  editAddress: (id: number) => void;
  deleteAddress: (id: number) => Promise<void>;
  defaultAddressId: number;  
  setShowMessageModal: React.Dispatch<React.SetStateAction<boolean>>;
  userInfoIsValid: boolean;
};

interface PropsModal {
  type: typeModal;  
  setType: React.Dispatch<React.SetStateAction<typeModal>>;
  addressEdit: AddressEdit;
  setAddressEdit: React.Dispatch<React.SetStateAction<AddressEdit>>;  
  resetEditAddress: () => void;
  updateAddress: () => Promise<void>;
  handleAddressModal: (value: boolean) => void;
};

enum typeModal {
  edit,
  add
};

interface MessageProps {
  setShowMessageModal: React.Dispatch<React.SetStateAction<boolean>>
};

const AddressesTable: FC<PropsTable> = ({ setType, listAddresses, handleAddressModal, editAddress, defaultAddressId, deleteAddress, setShowMessageModal, userInfoIsValid }) => {     
  const { t } = useTranslation();
  const { isB2E } = useUser();
  const [page, setPage] = useState(0);
  const limitPerPage = 4;
  const startIndex = page * limitPerPage;
  const endIndex = startIndex + limitPerPage;
  const maxPage = Math.ceil(listAddresses.length / limitPerPage);
  const pages = rangeArray(0, maxPage); 

  const handlePage = (type: string) => {
    if (type === "next") {
      setPage((prev) => {
        if (prev + 1 <= maxPage - 1) {
          return prev + 1;
        }
        return prev;
      })
    } else if (type === "back") {
      setPage((prev) => {
        if (prev - 1 >= 0) {
          return prev - 1;
        }
        return prev;
      })
    }
  };

  const handleOpenModal = () => {
    if (!userInfoIsValid) {
      setShowMessageModal(true);
    } else {
      handleAddressModal(true);
    }
  };

  const handleEdit = (id: number) => {
    editAddress(id);
    setType(typeModal.edit);
  };
  
  return (
    <SC.ContainerTable>
      <SC.ListAddress>
        {listAddresses.length ? listAddresses.slice(startIndex, endIndex).map((a) => 
          <SC.Address key={a.addressId}>
            <SC.AddressTitle onClick={() => handleEdit(a.addressId)} isBold={defaultAddressId === a.addressId}>{a.street}</SC.AddressTitle>
            {a.id_price_list ? 
            <SC.StarWrap>
              <img src={StarIcon} alt="" />
              <SC.TooltipStar>{t("account.tooltip_star_msg")}</SC.TooltipStar>
            </SC.StarWrap> : null}
            {!a.id_price_list ? <SC.DeleteWrapper onClick={() => deleteAddress(a.addressId)}>
              <Delete />
            </SC.DeleteWrapper> : 
            <SC.DeleteWrapper>
              <img onClick={() => handleEdit(a.addressId)} loading="lazy" src={EditIcon} alt="edit-icon" />
            </SC.DeleteWrapper>
            }
          </SC.Address>
        ): null}
      </SC.ListAddress>
      {!isB2E ? <SC.AddAddress onClick={() => handleOpenModal()}>{t("account.newaddress")}</SC.AddAddress> : null}
      {listAddresses.length ? <SC.Pages>
        <SC.Arrow rotate={true} disable={page === 0} src={ArrowLeft} onClick={() => handlePage("back")} alt="arrow-left" />
        {pages.length ? pages.map((p) => 
          <SC.Page 
            key={`page_${p}`}
            isSelected={page === p}
            onClick={() => setPage(p)}
          >
            {p + 1}          
          </SC.Page>
          ): null}
        <SC.Arrow src={ArrowLeft} disable={page === maxPage - 1} onClick={() => handlePage("next")} alt="ArrowRight" />
      </SC.Pages> : null}
    </SC.ContainerTable>
  )
};

const AddressModal: FC<PropsModal> = ({ type, setType, addressEdit, setAddressEdit, resetEditAddress, updateAddress, handleAddressModal }) => {
  const { t } = useTranslation();
  const [mapError, setMapError] = useState(false);
  const [formIsValid, setFormIsValid] = useState(false);
  const [loading, setLoading] = useState(false);  

  const checkIsFormValid = () => {
    if (!addressEdit.latitude || !addressEdit.longitude || !addressEdit.street || !addressEdit.city ) {
      setFormIsValid(false);
    } else {
      setFormIsValid(true);
    }
  };

  useEffect(() => {
    checkIsFormValid();
  },[addressEdit]);

  // capture cords map
  useEffect(() => {
    (window as any).updateMapUsed = () => {
      setAddressEdit((prev) => ({
        ...prev,
        latitude: String((window as any).latitude),
        longitude: String((window as any).longitude),
      }));
    }
  }, []);

  // set error map if user not selected cords
  useEffect(() => {
    if (!addressEdit.latitude || !addressEdit.longitude) {
      setMapError(true);
    } else {
      setMapError(false);
    }
  }, [addressEdit.latitude, addressEdit.longitude]);

  const handleClose = () => {
    setType(typeModal.add);
    handleAddressModal(false);
    resetEditAddress();
  };  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    e.persist();    
    setAddressEdit((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (e.target.name === "city") {
      setLatLng(e.target.value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formIsValid) {
      try {
        setLoading(true);
        await updateAddress();        
      } catch (e) {
        console.log("Error addAddress", e);
      } finally {
        setLoading(false);
        handleClose();
      }
    }
  };

  return (
    <SC.ModalCourtain>
      <SC.Modal fullSize={true}>
        <SC.Header>
          <SC.HeaderTitle>{type === typeModal.add ? t("account.modal.title") : t("account.modal.edit_title")}</SC.HeaderTitle>
          <SC.CloseWrapper onClick={() => handleClose()}>
            <Close />
          </SC.CloseWrapper>          
        </SC.Header>
        <SC.Form.Wrapper onSubmit={handleSubmit}>
          <SC.Form.Group>
            <div>
              <SC.Form.Label>{t("checkout.delivery.city")}</SC.Form.Label>
              <SC.Form.Select 
                value={addressEdit.city} 
                onChange={handleChange} 
                name={"city"}
                className={!addressEdit.city ? "error" : ""}
                disabled={Boolean(addressEdit.id_price_list)}
                isB2E={Boolean(addressEdit.id_price_list)}
              >
                <option value="" selected disabled hidden>
                  {t("checkout.delivery.city")}</option>
                {cities.map((c) => 
                  <option key={c.key}>{c.value}</option>
                )}
              </SC.Form.Select>
            </div>
            <div>           
              <SC.Form.Label>{t("checkout.delivery.address")}</SC.Form.Label>
              <SC.Form.Input
                name={"street"}
                value={addressEdit.street}
                onChange={handleChange}
                type="text"
                placeholder={t("checkout.delivery.address_ph")}
                className={!addressEdit.street ? "error" : ""}
              />
            </div>
          </SC.Form.Group>
          <SC.Form.Label>{t("checkout.delivery.reference")}</SC.Form.Label>
          <SC.Form.Input
            name={"reference"}
            value={addressEdit.reference}
            onChange={handleChange}
            type="text"
            placeholder={t("checkout.delivery.reference_ph")}
          />
          <SC.Form.Map mapError={mapError}>
            <Map />
          </SC.Form.Map>
          <SC.Form.CtaWrapper>
            {!loading ? 
            <Cta 
              active={formIsValid}
              filled={true}
              action={handleSubmit}
              text={ type === typeModal.edit ? t("account.modal.edit_title") : t("account.modal.add")}
            /> :
            <SC.Loader src="/images/loader.svg" alt="loader" />}
          </SC.Form.CtaWrapper>
        </SC.Form.Wrapper>
      </SC.Modal>
    </SC.ModalCourtain>
  )
};

const MessageModal: FC<MessageProps> = ({ setShowMessageModal }) => {
  const { t } = useTranslation();

  return (
    <SC.ModalCourtain>
      <SC.Modal padding="10px">
        <SC.CloseWrapper onClick={() => setShowMessageModal(false)}>
          <Close />
        </SC.CloseWrapper>  
        <SC.Message>{t("account.modal.message")}</SC.Message>
      </SC.Modal>
    </SC.ModalCourtain>
  )
};

const Addresses: FC = () => { 
  const { t } = useTranslation();
  const [type, setType] = useState(typeModal.add);
  const { 
    getDetails,
    addresses: listAddresses,
    addressEdit,
    setAddressEdit,     
    defaultAddressId,
    openAddressModal,
    updateAddress,
    deleteAddress,
    editAddress,
    resetEditAddress,
    handleAddressModal,
    showMessageModal,
    setShowMessageModal,
    userInfoIsValid
  } = useAddress();

  useEffect(() => {
    getDetails();
  }, []);   

  return (
    <SC.AddressesContainer>
      <SC.Title>{t("account.addresses")}</SC.Title>
      <AddressesTable 
        setType={setType}
        listAddresses={listAddresses} 
        handleAddressModal={handleAddressModal}
        editAddress={editAddress}
        defaultAddressId={defaultAddressId}
        deleteAddress={deleteAddress}  
        userInfoIsValid={userInfoIsValid}
        setShowMessageModal={setShowMessageModal}      
      />
      {openAddressModal ? 
        <AddressModal 
          type={type} 
          setType={setType}  
          addressEdit={addressEdit}  
          setAddressEdit={setAddressEdit}
          resetEditAddress={resetEditAddress} 
          updateAddress={updateAddress} 
          handleAddressModal={handleAddressModal}       
        /> : null} 
      {showMessageModal ? <MessageModal setShowMessageModal={setShowMessageModal}/> : null}
    </SC.AddressesContainer>
  )
};

export default Addresses;