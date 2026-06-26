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
    },
});

export const { setItem, addItem, removeItem, updateQuantity } = cartSlice.actions;

export default cartSlice.reducer;
