import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sellerProducts: [],
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setSellerProducts: (state, action) => {
      state.sellerProducts = action.payload;
    },
    
  },
});

export const { setSellerProducts } = productSlice.actions;

export default productSlice.reducer;
