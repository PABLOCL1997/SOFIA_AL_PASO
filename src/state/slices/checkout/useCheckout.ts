import { useAppDispatch } from "../../store";
import { setRedirectToCheckout, setIsGuestOrder } from "./index";

export const useCheckout = () => {
  const dispatch = useAppDispatch();

  const handleRedirectToCheckout = (value: boolean) => {
    dispatch(setRedirectToCheckout(value));
  };  

  const handleIsGuestOrder = (value: boolean) => {
    dispatch(setIsGuestOrder(value));
  };  

  return {
    handleRedirectToCheckout,
    handleIsGuestOrder
  };
};