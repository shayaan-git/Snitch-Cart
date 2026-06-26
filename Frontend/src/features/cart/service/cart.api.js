import axios from "axios";

const cartApiInstance = axios.create({
  baseURL: "/api/cart",
  withCredentials: true,
});

export const addItem = async ({ productId, variantId, quantity = 1 }) => {
  const url = variantId
    ? `/add/${productId}/${variantId}`
    : `/add/${productId}`;

  const response = await cartApiInstance.post(url, { quantity });
  return response.data;
};

export const getCart = async () => {
  // withcredentials: true because cart api is protected route and we need to send cookies to access it (by the way apiInstance mein already de rakha hai.)
  const response = await cartApiInstance.get("/", { withCredentials: true });
  return response.data;
};
