import { useState, useEffect, useMemo } from "react";
import { QueryLazyOptions, useMutation, useQuery } from "@apollo/react-hooks";
import { OperationVariables, useLazyQuery } from "react-apollo";
import { DETAILS, GET_USER } from "../graphql/user/queries";
import { UserType } from "../graphql/user/type";
import { ADD_ADDRESS, REMOVE_ADDRESS, SET_USER, UPDATE_B2E_ADDRESS } from "../graphql/user/mutations";
import { setLatLng } from "../utils/googlemaps";

export interface UserInfo {
  firstname?: string;
  lastname?: string;
  email?: string;
  telephone?: string; 
  employee?: number | null; 
  nit?: string;
};

export interface Addresses {
  city: string;
  addressId: number;
  id_address_ebs: number | null;
  id_price_list: number | null;
  latitude: string;
  longitude: string;
  reference: string;
  street: string;
};

export interface AddressEdit extends UserInfo, Addresses {
  billing: number;  
  password: string;
};

export type GetDetails = (options?: QueryLazyOptions<OperationVariables> | undefined) => void;
type Details = UserType;

const INITIAL_ADDRESS = {
  employee: null,
  addressId: 0,
  billing: 0,
  city: "",
  email: "",
  firstname: "",
  lastname: "",
  latitude: "",
  longitude: "",
  password: "",
  reference: "",
  street: "",
  telephone: "",
  id_address_ebs: null,
  id_price_list: null,
};

const useAddress = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({});
  const [addresses, setAddresses] = useState<Addresses[]>([]);
  const [addressEdit, setAddressEdit] = useState<AddressEdit>(INITIAL_ADDRESS);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [userInfoIsValid, setUserInfoIsValid] = useState(false);

  const { data: userData } = useQuery(GET_USER);
  const lazyDetails = useLazyQuery(DETAILS, { fetchPolicy: "network-only" });
  const getDetails: GetDetails = lazyDetails[0];
  const details: Details = lazyDetails[1]?.data?.details;

  const [setUser] = useMutation(SET_USER);
  const [doRemoveAddress] = useMutation(REMOVE_ADDRESS); 
  const [addAddress] = useMutation(ADD_ADDRESS, { variables: addressEdit });
  const [updateB2EAddress] = useMutation(UPDATE_B2E_ADDRESS); 
  
  const handleAddressModal = (value: boolean) => {
    setUser({
      variables: { user: { openAddressModal: value } }
    });
  };  

  const defaultAddressId = useMemo(() => {
    return userData?.userInfo[0]?.defaultAddressId;
  }, [userData?.userInfo[0]?.defaultAddressId]);

  const openAddressModal = useMemo(() => {
    return userData?.userInfo[0]?.openAddressModal;
  }, [userData?.userInfo[0]?.openAddressModal]);

  const updateAddress = async () => {
    await addAddress();        
    if (addressEdit.id_address_ebs) {
      await updateB2EAddress({
        variables: {
          Id_Cliente: addressEdit.employee,
          Id_Direccion: addressEdit.id_address_ebs,
          Direccion: addressEdit.street,
          Ciudad: addressEdit.city,
          Telefono: addressEdit.telephone,
          Latitud: addressEdit.latitude,
          Longitud: addressEdit.longitude,
        },
      });
    }
    await getDetails();
    // update label city modal if user edit address selected
    if (addressEdit.addressId === defaultAddressId) {
      await setUser({
        variables: { user: { defaultAddressLabel: addressEdit.street } }
      });
    };
  };

  const deleteAddress = async (id: number) => {
    try {
      await doRemoveAddress({ variables: { addressId: id } });
      // remove address from user info, if user previously select that address
      if (id === defaultAddressId) {
        await setUser({
          variables: {
            user: {
              defaultAddressLabel: "Santa Cruz",
              defaultAddressId: null,
            }
          }
        });        
      }
      await getDetails();
    } catch(e) {
      console.log("Error to remove address", e);
    }
  }; 

  const editAddress = (id: number) => {
    if (!userInfoIsValid) {
      setShowMessageModal(true);
      return;
    };

    setAddressEdit(() => {
      const addressSelected = addresses.find((a) => a.addressId === id);
      // set address cords
      let i = setInterval(() => {
        if ((window as any).map) {
          clearInterval(i);
          if (addressSelected?.latitude && addressSelected?.longitude) {
            setLatLng("", addressSelected.latitude, addressSelected.longitude);
          }
        }
      }, 10);

      return {
        ...userInfo,
        ...addressSelected,
        billing: 0,
        password: "",        
      } as AddressEdit;
    });  
    handleAddressModal(true);  
  };

  const resetEditAddress = () => {
    setAddressEdit(({
      ...INITIAL_ADDRESS,
      ...userInfo
    }))
  };
  
  //set user addresses
  useEffect(() => {    
    if (details?.addresses) {
      const addressesMap = details.addresses.map((a) => ({
        city: a.city as string,
        addressId: a.id as number,
        id_address_ebs: a.id_address_ebs as number,
        id_price_list: a.id_price_list as number,
        latitude: a.latitude as string,
        longitude: a.longitude as string,
        reference: a.reference as string,
        street: a.street as string,
      }));
      setAddresses(addressesMap);
    }
  }, [details?.addresses]);

  // set user info
  useEffect(() => {
    setUserInfo(({
      firstname: details?.firstname,
      lastname: details?.lastname,
      email: details?.email, 
      telephone: details?.phone, 
      employee: details?.employee as number, 
      nit: details?.nit,
    }));
    setAddressEdit((prev) => ({
      ...prev,
      firstname: details?.firstname,
      lastname: details?.lastname,
      email: details?.email, 
      telephone: details?.phone, 
      nit: details?.nit,
    }));
  }, [details]); 

  //validate userInfo
  useEffect(() => {
    if (userInfo.firstname && userInfo.lastname && userInfo.email && userInfo.telephone && userInfo.nit) {
      setUserInfoIsValid(true);
    } else {
      setUserInfoIsValid(false);
    }
  },[userInfo]);  

  return {
    getDetails,
    addresses,
    addressEdit,
    setAddressEdit,
    userInfo, 
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
  }
};

export default useAddress;