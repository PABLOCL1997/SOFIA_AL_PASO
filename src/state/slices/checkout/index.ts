import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { slices } from "../types";

export interface Checkout {
  redirectToCheckout: boolean;
  isGuestOrder: boolean;
}

const initialState: Checkout = {
  redirectToCheckout: false,
  isGuestOrder: false,
};

export const checkoutSlice = createSlice({
  name: slices.checkout,
  initialState,
  reducers: {
    setRedirectToCheckout: (state, action: PayloadAction<boolean>) => {
      state.redirectToCheckout = action.payload;
    },
    setIsGuestOrder: (state, action: PayloadAction<boolean>) => {
      state.isGuestOrder = action.payload;
    }
  },
});

export const { setRedirectToCheckout, setIsGuestOrder } = checkoutSlice.actions;

export default checkoutSlice.reducer;