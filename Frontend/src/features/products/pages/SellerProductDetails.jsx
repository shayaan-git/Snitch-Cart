import React from "react";

const SellerProductDetails = () => {
  const { handleGetProductById } = useProduct();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await handleGetProductById(productId);
      setProduct(data?.product || data);
      setLoading(false);
    })();
  }, [productId]);

  return <div>SellerProductDetails</div>;
};

export default SellerProductDetails;
