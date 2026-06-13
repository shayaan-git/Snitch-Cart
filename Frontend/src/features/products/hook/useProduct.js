import {
  getSellerProduct,
  createSellerProduct,
} from "../service/product.api.js";
import { useDispatch } from "react-redux";
import { setSellerProducts } from "../state/product.slice.js";

export const useProduct = () => {
  const dispatch = useDispatch();

  /**
   * isme backend API manage kar rahe honge
   * @param {formData}
   * @returns create product
   */
  async function handleCreateSellerProduct(formData) {
    const data = await createSellerProduct(formData);
    return data.product;
  }

  /**
   * isme backend API aur state dono manage ho rahi kyuki products ka state manage karna rahega
   * @returns products of seller
   */
  async function handleGetSellerProduct() {
    const data = await getSellerProduct();
    dispatch(setSellerProducts(data.products));
    return data.products;
  }

  return { handleCreateSellerProduct, handleGetSellerProduct };
};
