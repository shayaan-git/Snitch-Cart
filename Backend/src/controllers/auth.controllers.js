import { configs } from "../config/config.js";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

async function sendTokenResponse(user, res, message) {
  const token = jwt.sign(
    {
      id: user._id,
    },
    configs.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  res.cookie("token", token);

  res.status(200).json({
    message,
    success: true,
    user: {
      id: user._id,
      email: user.email,
      fullname: user.fullname,
      contact: user.contact,
      role: user.role,
    },
  });
}

export const registerUser = async (req, res) => {
  // console.log("BODY:", req.body);
  try {
    const { email, password, contact, fullname, isSeller } = req.body;
    // console.log("email:", email, "contact:", contact);

    const existingUser = await userModel.findOne({
      $or: [{ email }, { contact }],
    });
    // console.log("existingUser:", existingUser);

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or contact already in use" });
    }

    const user = await userModel.create({
      email,
      password,
      fullname,
      contact,
      role: isSeller ? "seller" : "buyer",
    });

    await sendTokenResponse(user, res, "User registered successfully");

    // return res.status(201).json({
    //   message: "User registered successfully",
    // });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
