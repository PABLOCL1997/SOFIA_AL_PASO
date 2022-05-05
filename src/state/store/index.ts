import { configureStore } from "@reduxjs/toolkit";
import modalsReducer from "../slices/modals";
import checkoutReducer from "../slices/checkout";
import { TypedUseSelectorHook, useSelector, useDispatch } from "react-redux";

export const store = configureStore({
  reducer: {
    modals: modalsReducer,
    checkout: checkoutReducer,
  },
});

type GlobalState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<GlobalState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();