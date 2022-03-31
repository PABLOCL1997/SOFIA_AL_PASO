import { useMutation, useQuery } from "@apollo/react-hooks";
import { useMemo } from "react";
import { SET_USER } from "../graphql/user/mutations";
import { GET_USER } from "../graphql/user/queries";
import { OrderType } from "../types/Order";

interface IUseUser {
  toggleCartModal: Function;
  toggleCityModal: Function;
  toggleLoginModal: Function;
  togglePromoBar: Function;
  toggleExpressModal: Function;
  showAddressInfo: Function;
  hideAddressInfo: Function;
  hideBar: Function;
  hideExpressModal: Function;
  logout: Function;
  user: any;
  isLoggedIn: boolean;
  store: OrderType;
  coupon: string | null;
  showPromoBar: boolean;
  showExpressModal: boolean;
  isB2E: boolean;
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
  const [togglePromoBar] = useMutation(SET_USER, {
    variables: { user: { showPromoBar: true } },
  });
  const [toggleExpressModal] = useMutation(SET_USER, {
    variables: { user: { showExpressModal: true } },
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
  const [hideBar] = useMutation(SET_USER, {
    variables: { user: { showPromoBar: false } },
  });
  const [hideExpressModal] = useMutation(SET_USER, {
    variables: { user: { showExpressModal: false } },
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

  const isLoggedIn = useMemo(() => {
    if (user?.userInfo?.length) return user.userInfo[0].isLoggedIn;
    return false;
  }, [user]);

  const store: OrderType = useMemo(() => {
    return user?.userInfo[0]?.store || 'ECOMMERCE';
  }, [user])

  const showPromoBar: boolean = useMemo(() => {
    return user?.userInfo[0]?.showPromoBar;
  }, [user]);

  const showExpressModal: boolean = useMemo(() => {
    return user?.userInfo[0]?.showExpressModal || false;
  }, [user]);

  const isB2E: boolean = useMemo(() => {
    return user?.userInfo[0]?.isB2E;
  }, [user])

  return {
    toggleCartModal,
    toggleCityModal,
    toggleLoginModal,
    togglePromoBar,
    toggleExpressModal,
    showAddressInfo,
    hideAddressInfo,
    hideBar,
    hideExpressModal,
    logout,
    user,
    isLoggedIn,
    store,
    coupon,
    showPromoBar,
    showExpressModal,
    isB2E
  };
};

export default useUser;
