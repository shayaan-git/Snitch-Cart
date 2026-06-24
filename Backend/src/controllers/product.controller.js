import { uploadFile } from "../../services/storage.service.js";
import productModel from "../models/product.model.js";

export async function createProduct(req, res) {
  const { title, description, priceAmount, priceCurrency } = req.body;
  const seller = req.user;

  const attributes = JSON.parse(req.body.attributes || "{}");
  const stock = req.body.stock ? Number(req.body.stock) : undefined;

  const images = await Promise.all(
    req.files.map(async (file) => {
      return await uploadFile({
        buffer: file.buffer,
        fileName: file.originalname,
      });
    }),
  );

  const product = await productModel.create({
    title,
    description,
    attributes,
    ...(stock !== undefined && { stock }),
    price: {
      amount: priceAmount,
      currency: priceCurrency || "INR",
    },
    images,
    seller: seller._id,
  });

  res.status(201).json({
    message: "Product created successfully",
    success: true,
    product,
  });
}

export async function getSellerProducts(req, res) {
  const seller = req.user;

  const products = await productModel.find({ seller: seller._id });

  return res.status(200).json({
    message: "Products fetched successfully",
    success: true,
    products,
  });
}

export async function getAllProducts(req, res) {
  const products = await productModel.find();

  return res.status(200).json({
    message: "products fetched successfully",
    success: true,
    products,
  });
}

export async function getProductDetails(req, res) {
  const { id } = req.params;

  const product = await productModel.findById(id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
      success: true,
    });
  }

  return res.status(200).json({
    message: "Product fetched successfully",
    success: true,
    product,
  });
}

export async function addProductVariant(req, res) {
  const productId = req.params.productId;

  const product = await productModel.findOne({
    _id: productId,
    seller: req.user._id,
  });

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
      success: false,
    });
  }

  const files = req.files;
  const images = [];

  if (files && files.length !== 0) {
    const imageVarient = await Promise.all(
      files.map(async (file) => {
        const image = await uploadFile({
          buffer: file.buffer,
          fileName: file.originalname,
        });
        return { url: image.url };
      }),
    );
    imageVarient.forEach((image) => images.push(image));
  }

  const price = req.body.priceAmount;
  const stock = req.body.stock;
  const attributes = JSON.parse(req.body.attributes || "{}");

  product.variants.push({
    images,
    stock,
    price: {
      amount: Number(price) || product.price.amount,
      currency: req.body.priceCurrency || product.price.currency,
    },
    attributes,
  });

  await product.save();

  return res.status(200).json({
    message: "Product variant added successfully",
    success: true,
    product,
  });
}
