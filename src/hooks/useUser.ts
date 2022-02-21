import { useMutation, useQuery } from "@apollo/react-hooks";
import { useMemo } from "react";
import { SET_USER } from "../graphql/user/mutations";
import { GET_USER } from "../graphql/user/queries";
import { OrderType } from "../types/Order";

interface IUseUser {
  toggleCartModal: Function;
  toggleCityModal: Function;
  toggleLoginModal: Function;
  showAddressInfo: Function;
  hideAddressInfo: Function;
  logout: Function;
  user: any;
  store: OrderType;
  coupon: string | null;
}

const useUser = (): IUseUser => {
  const { data: user } = useQuery(GET_USER, {});

  const [toggleCartModal] = useMutation(SET_USER, {
    variables: { user: { openCartModal: true } },
  });
  const [toggleCityModal] = useMutation(SET_USER, {
    variables: { user: { openCityModal: true } },
  });
  const [toggleLoginModal] = useMutation(SET_USER, {
    variables: { user: { openLoginModal: true } },
  });

  const [showAddressInfo] = useMutation(SET_USER, {});
  const [hideAddressInfo] = useMutation(SET_USER, {
    variables: {
      user: {
        addressInfo: null,
        addressType: null,
      },
    },
  });

  const coupon: string | null = useMemo(() => {
    return user?.userInfo[0]?.coupon;
  }, [user]);

  const [logout] = useMutation(SET_USER, {
    variables: {
      user: {
        cityKey: "SC",
        cityName: "Santa Cruz",
        defaultAddressLabel: "Santa Cruz",
        agency: null,
        idPriceList: 0,
        defaultAddressId: null,
        isLoggedIn: false,
        id: null,
      },
    },
  });

  const store: OrderType = useMemo(() => {
    return user?.userInfo[0]?.store || 'ECOMMERCE';
  }, [user])

  return {
    toggleCartModal,
    toggleCityModal,
    toggleLoginModal,
    showAddressInfo,
    hideAddressInfo,
    logout,
    user,
    store,
    coupon
  };
};

export default useUser;
