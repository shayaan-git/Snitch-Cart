import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sellerProducts: [],
  products: [],
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
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setProductsLoading: (state, action) => {
      state.loading = action.payload;
    },
    setProductsError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setSellerProducts,
  setProductsLoading,
  setProductsError,
  setProducts,
} = productSlice.actions;

export default productSlice.reducer;
