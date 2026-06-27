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
  const response = await cartApiInstance.get("/");
  return response.data;
};

export const incrementCartItemApi = async ({productId, variantId}) => {
  const url = variantId
    ? `/quantity/increment/${productId}/${variantId}`
    : `/quantity/increment/${productId}`;

  const response = await cartApiInstance.patch(url);
  return response.data;
};
