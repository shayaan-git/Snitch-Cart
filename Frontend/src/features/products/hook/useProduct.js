import {
  getSellerProduct,
  createSellerProduct,
  getAllProducts,
  getProductById,
  addProductVariant,
  updateSellerProduct,
  updateProductVariant,
  deleteProductVariant,
  deleteProduct,
} from "../service/product.api.js";
import { useDispatch } from "react-redux";
import {
  setSellerProducts,
  setProducts,
  setProductsLoading,
  setProductsError,
} from "../state/product.slice.js";

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
    dispatch(setProductsLoading(true));
    dispatch(setProductsError(null));
    try {
      const data = await getSellerProduct();
      dispatch(setSellerProducts(data.products));
      return data.products;
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Failed to load products. Please try again.";
      dispatch(setProductsError(msg));
    } finally {
      dispatch(setProductsLoading(false));
    }
  }

  /**
   * isme backend API aur state dono manage ho rahi kyuki products ka state manage karna rahega
   * @returns products of seller
   */
  async function handleGetAllProducts() {
    const data = await getAllProducts();
    dispatch(setProducts(data.products));
  }

  async function handleGetProductById(productId) {
    const data = await getProductById(productId);
    return data.product;
  }

  async function handleAddProductVariant(productId, newProductVariantparams) {
    const data = await addProductVariant(productId, newProductVariantparams);
    return data;
  }

  async function handleUpdateSellerProduct(productId, updatedProduct) {
    const data = await updateSellerProduct(productId, updatedProduct);
    return data.product;
  }

  async function handleUpdateProductVariant(
    productId,
    variantId,
    updatedVariantParams,
  ) {
    const data = await updateProductVariant(
      productId,
      variantId,
      updatedVariantParams,
    );
    return data.product;
  }

  async function handleDeleteProductVariant(productId, variantId) {
    const data = await deleteProductVariant(productId, variantId);
    return data.product;
  }

  async function handleDeleteProduct(productId) {
    const data = await deleteProduct(productId);
    return data;
  }

  return {
    handleCreateSellerProduct,
    handleGetSellerProduct,
    handleGetAllProducts,
    handleGetProductById,
    handleAddProductVariant,
    handleUpdateSellerProduct,
    handleUpdateProductVariant,
    handleDeleteProductVariant,
    handleDeleteProduct,
  };
};
