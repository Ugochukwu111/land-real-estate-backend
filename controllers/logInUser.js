import validator from "validator";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import {  generateTokens, setRefreshToken } from "../helpers/generateTokens.js";

export default async function logInUser(req, res) {
  let { email, password } = req.body;
  email = email.trim();

  if (!email || !password) {
    return res.status(400).json({ error: "All fields required" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "must be an email" });
  }

  try {
    const existingUser = await User.findOne({ email: email });

    if (!existingUser) {
      return res.status(400).json({ error: "emails is not registered" });
    }
    const matchingPassword = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!matchingPassword) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const { accessToken, refreshToken } = generateTokens(existingUser._id);

    setRefreshToken(res, refreshToken);

    return res.status(201).json({
      message: 'Login Successful',
      accessToken,
    })

  } catch (err) {
    console.error("Login Error", err.message);
  }
}
