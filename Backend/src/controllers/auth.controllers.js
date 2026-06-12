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

  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    await sendTokenResponse(user, res, "User logged in successfully");
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// req.body is not used here because...
export const googleCallback = async (req, res) => {
  // console.log(req.user);
  const { id, displayName, emails, photos } = req.user;

  const email = emails[0].value;
  const profilePic = photos[0].value;

  try {
    let user = await userModel.findOne({
      $or: [{ email }, { googleId: id }],
    });

    if (!user) {
      user = await userModel.create({
        email,
        googleId: id,
        fullname: displayName,
        profilePic,
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      configs.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      // httpOnly: true, // ✅ Prevents JS access (XSS protection)
      // secure: process.env.NODE_ENV === "production", // ✅ HTTPS only in prod
      // sameSite: "lax", // ✅ CSRF protection
    });

    res.redirect("http://localhost:5173/");
  } catch (error) {
    console.error("Error in Google callback:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
