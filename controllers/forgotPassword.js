import validator from "validator";
import User from "../models/User.js";
import { generateAndSendOTP } from "../helpers/SendOtp.js";

export default async function forgotPassword(req, res) {
  const { email } = req.body; 
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  } 

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Must be a valid email" });
  }

  try {
    const existingUser = await User.findOne({ email: email });

    if (!existingUser) {
      return res.status(400).json({ error: "Email is not registered" });
    } else {
      await generateAndSendOTP(existingUser.email, "forgot-password");
      return res.status(201).json({ message: "OTP sent successfully" , email: existingUser.email});
    } 

}catch (err) {
    console.error("Forgot Password Error", err.message);
    return res.status(500).json({ error: "An error occurred while processing your request. Please try again later." });
  }
}