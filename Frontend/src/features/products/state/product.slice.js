import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sellerProducts: [],
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setSellerProducts: (state, action) => {
      state.sellerProducts = action.payload;
    },
    setProductsLoading: (state, action) => {
      state.loading = action.payload;
    },
    setProductsError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setSellerProducts, setProductsLoading, setProductsError } =
  productSlice.actions;

export default productSlice.reducer;
