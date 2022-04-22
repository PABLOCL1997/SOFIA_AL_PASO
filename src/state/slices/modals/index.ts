import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { slices } from "../types";

export interface Modals {
  showChooseUserType: boolean;
  showRegisterModal: boolean;
}

const initialState: Modals = {
  showChooseUserType: false,
  showRegisterModal: false,
};

export const modalsSlice = createSlice({
  name: slices.modals,
  initialState,
  reducers: {
    setShowChooseUserType: (state, action: PayloadAction<boolean>) => {
      state.showChooseUserType = action.payload;
    },
    setShowRegisterModal: (state, action: PayloadAction<boolean>) => {
      state.showRegisterModal = action.payload;
    },
  },
});

export const { setShowChooseUserType, setShowRegisterModal } = modalsSlice.actions;

export default modalsSlice.reducer;