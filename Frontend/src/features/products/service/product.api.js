import axios from "axios";

const productApiInstance = axios.create({
  baseURL: "/api/products",
  withCredentials: true,
});

/*
baseURL: "http://localhost:3000/api/products",
comment out this backend URL because proxy has been set up in vite.config.js
*/

// In network tab it shows ↪ http://localhost:5173/api/products/
export async function createSellerProduct(formData) {
  const response = await productApiInstance.post("/", formData);
  return response.data;
}

// In network tab it shows ↪ http://localhost:5173/api/products/seller
export async function getSellerProduct() {
  const response = await productApiInstance.get("/seller");
  return response.data;
}

// In network tab it shows ↪ http://localhost:5173/api/products/
export async function getAllProducts() {
  const response = await productApiInstance.get("/");
  return response.data;
}

// In network tab it shows ↪ http://localhost:5173/api/products/detail/:productId
export async function getProductById(productId) {
  const response = await productApiInstance.get(`/detail/${productId}`);
  return response.data;
}

// In network tab it shows ↪ http://localhost:5173/api/products/:productId/variants
export async function addProductVariant(productId, newProductVariant) {
  console.log("newprodVariant:", newProductVariant);
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
