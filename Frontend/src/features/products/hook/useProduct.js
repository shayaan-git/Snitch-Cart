import {
  getSellerProduct,
  createSellerProduct,
} from "../service/product.api.js";
import { useDispatch } from "react-redux";
import { setSellerProducts } from "../state/product.slice.js";

export const useProduct = () => {
  const dispatch = useDispatch();

  async function handleCreateSellerProduct(formData) {
    const data = await createSellerProduct(formData);
    return data.product;
  }

  async function handleGetSellerProduct() {
    const data = await getSellerProduct();
    dispatch(setSellerProducts(data.products));
    return data.products;
  }

  return { handleCreateSellerProduct, handleGetSellerProduct };
};
