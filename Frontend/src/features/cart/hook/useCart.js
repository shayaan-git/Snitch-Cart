import { useDispatch } from "react-redux";
import {
  addItem,
  decrementCartItemApi,
  getCart,
  incrementCartItemApi,
  removeCartItemApi,
} from "../service/cart.api.js";

import {
  addItem as addItemToCart,
  decrementCartItem,
  incrementCartItem,
  removeItem,
  setItem,
} from "../state/cart.slice.js";

export const useCart = () => {
  const dispatch = useDispatch();

  const handleAddItem = async ({ productId, variantId, quantity = 1 }) => {
    console.log("Adding item:", { productId, variantId });
    try {
      const data = await addItem({ productId, variantId, quantity });
      console.log("data", data);
      // dispatch(addItemToCart(data));
      return data;
    } catch (error) {
      console.error(
        "Error in adding item to cart : ",
        error.response?.data ?? error,
      );
    }
  };

  const handleGetCart = async () => {
    try {
      const data = await getCart();
      dispatch(setItem(data.cart.items));
    } catch (error) {
      console.error("Error in getting cart items : ", error);
    }
  };

  const handleIncrementCartItem = async ({ productId, variantId }) => {
    try {
      await incrementCartItemApi({ productId, variantId });
      dispatch(incrementCartItem({ productId, variantId }));
    } catch (error) {
      console.error("Error in incrementing cart item : ", error);
    }
  };

  const handleDecrementCartItem = async ({ productId, variantId }) => {
    try {
      await decrementCartItemApi({ productId, variantId });
      dispatch(decrementCartItem({ productId, variantId }));
    } catch (error) {
      console.error("Error in decrementing cart items :", error);
    }
  };

  const handleRemoveCartItem = async ({ productId, variantId, itemId }) => {
    try {
      await removeCartItemApi({ productId, variantId });
      dispatch(removeItem(itemId));
    } catch (error) {
      console.error("Error in removing cart item :", error);
    }
  };

  return {
    handleAddItem,
    handleGetCart,
    handleIncrementCartItem,
    handleDecrementCartItem,
    handleRemoveCartItem,
  };
};
