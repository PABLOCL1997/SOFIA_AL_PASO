import { useAppDispatch } from "../../store";
import { setShowChooseUserType, setShowRegisterModal } from "./index";

export const useModals = () => {
  const dispatch = useAppDispatch();

  const handleChooseUserType = (value: boolean) => {
    dispatch(setShowChooseUserType(value));
  };

  const handleRegisterModal = (value: boolean) => {
    dispatch(setShowRegisterModal(value));
  };

  return {
    handleChooseUserType,
    handleRegisterModal,
  };
};