import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setItem: (state, action) => {
      state.items = action.payload;
    },
    addItem: (state, action) => {
      state.items.push(action.payload);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((i) => i._id !== action.payload);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i._id === id);
      if (item && quantity > 0) {
        item.quantity = quantity;
      }
    },
    incrementCartItem: (state, action) => {
      const { productId, variantId } = action.payload;
      state.items = state.items.map((item) => {
        if (item.product._id === productId && item.variant === variantId) {
          return { ...item, quantity: item.quantity + 1 };
        } else {
          return item;
        }
      });
    },
    decrementCartItem: (state, action) => {
      const { productId, variantId } = action.payload;
      const item = state.items.find(
        (item) => item.product._id === productId && item.variant === variantId,
      );

      if (item?.quantity === 1) {
        // Remove the item entirely aur yahan Filter se sirf wahi items rakh rahe cart mein jo match nahi kar raha hoga
        state.items = state.items.filter(
          (item) =>
            !(item.product._id === productId && item.variant === variantId),
        );
      } else {
        // Just decrement - Map se hum har item ko check kar rahe hai, agar match hua to -1 kar rahe, nahi hua to waisa hi rakh rahe
        state.items = state.items.map((item) => {
          if (item.product._id === productId && item.variant === variantId) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        });
      }

    },
  },
});

export const {
  setItem,
  addItem,
  removeItem,
  updateQuantity,
  incrementCartItem,
  decrementCartItem,
} = cartSlice.actions;

export default cartSlice.reducer;
