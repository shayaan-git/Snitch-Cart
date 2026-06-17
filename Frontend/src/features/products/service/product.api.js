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
