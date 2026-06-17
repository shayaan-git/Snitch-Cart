import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useProduct } from "../hook/useProduct";

const ProductDetail = () => {
  const { productId } = useParams();
  // console.log("productId:", productId);

  const [product, setProduct] = useState(null);

  const { handleGetProductById } = useProduct();

  async function fetchProductDetails() {
    const data = await handleGetProductById(productId);
    setProduct(data);
  }

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  console.log(product)

  return <div>ProductDetail</div>;
};

export default ProductDetail;
