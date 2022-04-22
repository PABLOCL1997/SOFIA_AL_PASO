import { useAppDispatch } from "../../store";
import { setRedirectToCheckout } from "./index";

export const useCheckout = () => {
  const dispatch = useAppDispatch();

  const handleRedirectToCheckout = (value: boolean) => {
    dispatch(setRedirectToCheckout(value));
  };  

  return {
    handleRedirectToCheckout,
  };
};