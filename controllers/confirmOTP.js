import User from "../models/User.js";
import OTP from "../models/OTP.js";
import bcrypt from "bcryptjs";
import { generateAndSendOTP } from "../helpers/SendOtp.js";
import { generateTokens } from "../helpers/generateTokens.js";

export async function confirmOTP(req, res) {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "OTP required" });
  }

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return res.status(400).json({ error: "Email is not registered" });
  }

  const otpRecord = await OTP.findOne({ email });

  if (!otpRecord) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  // expiry check
  if (otpRecord.expiresAt < Date.now()) {
    await OTP.deleteMany({ email });

    return res.status(400).json({ error: "OTP has expired" });
  }

  // compare OTP
  const isMatch = await bcrypt.compare(otp, otpRecord.otp);

  if (!isMatch) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  existingUser.isEmailVerified = true;
  const { accessToken } = generateTokens(existingUser._id,  existingUser.role);
  await existingUser.save();

  await OTP.deleteMany({ email });

  return res.status(200).json({
    message: "Email verified successfully",
      user: {
        role: existingUser.role,
        id: existingUser._id,
        fullName: existingUser.fullName,
      },
    accessToken,
  });
}


export async function resendOTP(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return res.status(400).json({ error: "Email is not registered" });
  }

  try {
    await OTP.deleteMany({ email });
    await generateAndSendOTP(email);

    return res.status(200).json({
      message: "OTP resent successfully",
    });
  } catch (error) {
    console.error("❌ Error resending OTP:", error);

    return res.status(500).json({
      error: "Failed to resend OTP",
    });
  }
}
