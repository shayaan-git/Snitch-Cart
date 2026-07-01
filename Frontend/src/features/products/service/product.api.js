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

// // In network tab it shows ↪ http://localhost:5173/api/products/update/:productId
// export async function updateProduct(productId, updatedProduct) {
//   const formData = new FormData();

//   if (updatedProduct.title !== undefined) {
//     formData.append("title", updatedProduct.title);
//   }
//   if (updatedProduct.description !== undefined) {
//     formData.append("description", updatedProduct.description);
//   }
//   if (updatedProduct.stock !== undefined) {
//     formData.append("stock", updatedProduct.stock);
//   }
//   if (updatedProduct.price?.amount !== undefined) {
//     formData.append("priceAmount", updatedProduct.price.amount);
//   }
//   if (updatedProduct.price?.currency !== undefined) {
//     formData.append("priceCurrency", updatedProduct.price.currency);
//   }
//   if (updatedProduct.attributes !== undefined) {
//     formData.append("attributes", JSON.stringify(updatedProduct.attributes));
//   }

//   // only newly picked files, skip existing { url } images
//   (updatedProduct.images || [])
//     .filter((img) => img.file)
//     .forEach((image) => formData.append("images", image.file));

//   const response = await productApiInstance.patch(
//     `/update/${productId}`,
//     formData,
//   );
//   return response.data;
// }

// In network tab it shows ↪ http://localhost:5173/api/products/update/:productId
export async function updateSellerProduct(productId, updatedProduct) {
  const payload = {};

  if (updatedProduct.title !== undefined) {
    payload.title = updatedProduct.title;
  }
  if (updatedProduct.description !== undefined) {
    payload.description = updatedProduct.description;
  }
  if (updatedProduct.stock !== undefined) {
    payload.stock = updatedProduct.stock;
  }
  if (updatedProduct.price?.amount !== undefined) {
    payload.priceAmount = updatedProduct.price.amount;
  }
  if (updatedProduct.price?.currency !== undefined) {
    payload.priceCurrency = updatedProduct.price.currency;
  }
  if (updatedProduct.attributes !== undefined) {
    payload.attributes = JSON.stringify(updatedProduct.attributes);
  }

  const response = await productApiInstance.patch(`/${productId}`, payload);
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

// In network tab it shows ↪ http://localhost:5173/api/products/:productId/variants/:variantId
export async function updateProductVariant(productId, variantId, updatedVariant) {
  const payload = {};

  if (updatedVariant.stock !== undefined) {
    payload.stock = updatedVariant.stock;
  }
  if (updatedVariant.price?.amount !== undefined) {
    payload.priceAmount = updatedVariant.price.amount;
  }
  if (updatedVariant.price?.currency !== undefined) {
    payload.priceCurrency = updatedVariant.price.currency;
  }
  if (updatedVariant.attributes !== undefined) {
    payload.attributes = JSON.stringify(updatedVariant.attributes);
  }

  const response = await productApiInstance.patch(
    `/${productId}/variants/${variantId}`,
    payload,
  );
  return response.data;
}

// In network tab it shows ↪ http://localhost:5173/api/products/:productId/variants/:variantId
export async function deleteProductVariant(productId, variantId) {
  const response = await productApiInstance.delete(
    `/${productId}/variants/${variantId}`,
  );
  return response.data;
}

// In network tab it shows ↪ http://localhost:5173/api/products/:productId
export async function deleteProduct(productId) {
  const response = await productApiInstance.delete(`/${productId}`);
  return response.data;
}
