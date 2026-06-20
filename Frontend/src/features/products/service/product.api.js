import axios from "axios";

const productApiInstance = axios.create({
  baseURL: "/api/products",
  withCredentials: true,
});

// http://localhost:5173/api/products/
export async function createSellerProduct(formData) {
  const response = await productApiInstance.post("/", formData);
  return response.data;
}

// http://localhost:5173/api/products/seller
export async function getSellerProduct() {
  const response = await productApiInstance.get("/seller");
  return response.data;
}

export async function getAllProducts() {
  const response = await productApiInstance.get("/");
  return response.data;
}

export async function getProductById(productId) {
  const response = await productApiInstance.get(`/detail/${productId}`);
  return response.data;
}

export async function addProductVariant(productId, newProductVariant) {

  console.log(newProductVariant);
  const formData = new FormData();

  newProductVariant.images
    .filter((img) => img.file) // only newly picked files, skip existing { url }
    .forEach((image) => formData.append("images", image.file));

  formData.append("stock", newProductVariant.stock);
  formData.append("priceAmount", newProductVariant.price.amount);
  formData.append("priceCurrency", newProductVariant.price.currency);
  formData.append("attributes", JSON.stringify(newProductVariant.attributes));

  const response = await productApiInstance.post(
    `/${productId}/variants`,
    formData,
  );

  return response.data;
}
