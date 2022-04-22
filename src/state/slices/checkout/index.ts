import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { slices } from "../types";

export interface Checkout {
  redirectToCheckout: boolean;
}

const initialState: Checkout = {
  redirectToCheckout: false,
};

export const checkoutSlice = createSlice({
  name: slices.checkout,
  initialState,
  reducers: {
    setRedirectToCheckout: (state, action: PayloadAction<boolean>) => {
      state.redirectToCheckout = action.payload;
    },
  },
});

export const { setRedirectToCheckout } = checkoutSlice.actions;

export default checkoutSlice.reducer;