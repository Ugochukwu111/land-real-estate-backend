import bcrypt from "bcryptjs";
import { validateRegisterUserFields } from "../helpers/validate.js";
import User from "../models/User.js";
import { generateTokens } from "../helpers/generateTokens.js";

/**
 * @controller registerUser
 * @description Core registration pipeline for the Dilux platform. Handles input formatting,
 * delegates strict validation, enforces unique accounts, securely hashes passwords,
 * and implements a stateless authentication flow by generating JWTs upon successful creation.
 * * @security
 * - Passwords are cryptographically hashed using bcrypt (cost factor: 10).
 * - Implements a split-token architecture (Stateless JWT).
 * - The Refresh Token is planted in an HttpOnly cookie to prevent XSS attacks.
 * - Cookie is configured with sameSite: "none" and secure: true to support a
 * decoupled, cross-domain MERN architecture (e.g., Vercel frontend to Render API).
 * * @param {Object} req - Express request object containing { email, password, phoneNumber, termsAndCondition }.
 * @param {Object} res - Express response object.
 * * @returns {Object} 201 Created - Returns a success boolean, OTP prompt message, and the short-lived Access Token.
 * @returns {Object} 400 Bad Request - If validation fails or the email already exists.
 * @returns {Object} 500 Internal Server Error - For database or execution failures.
 */

export async function registerUser(req, res) {
  let { email, password, phoneNumber, termsAndCondition } = req.body;
  phoneNumber = phoneNumber?.trim();
  email = email?.trim()?.toLowerCase();

  const isValid = validateRegisterUserFields(
    req,
    res,
    email,
    password,
    phoneNumber,
    termsAndCondition,
  );
  if (!isValid) return;

  try {
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email: email,
      password: hashedPassword,
      phoneNumber: phoneNumber,
      termsAndCondition: termsAndCondition,
    });

    await newUser.save();
    const { accessToken, refreshToken } = generateTokens(newUser._id);

    res.cookie("refresh", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "Success! An OTP has been sent to your email.",
      success: true,
      accessToken,
    });
  } catch (err) {
    console.error(`Register User error: ${err.message}  `);
    return res.status(500).json({ error: "Registration Failed" });
  }
}
