import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import OTP from "../models/OTP.js";

dotenv.config();


const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * @function generateAndSendOTP
 * @description Invalidate old OTPs, generate a new secure 4-digit code, hash it, 
 * save it to MongoDB, and dispatch the plain text via Resend API.
 * @param {string} email - The user's registered email address.
 */

export const generateAndSendOTP = async (email) => {
  try {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    console.log(otp)

    const hashedOTP = await bcrypt.hash(otp, 10);

    await OTP.deleteMany({ email: email });

    await OTP.create({
      email: email,
      otp: hashedOTP,
    });

    const { data, error } = await resend.emails.send({
  
      from: "Dilux Security <onboarding@resend.dev>",
      to: email,
      subject: "Verify Your Account - Dilux",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
          <h2>Welcome to Dilux!</h2>
          <p>Your account security is our priority. Please use the verification code below to complete your registration.</p>
          <h1 style="font-size: 40px; letter-spacing: 5px; color: #3b82f6;">${otp}</h1>
          <p>This code will expire in <strong>15 minutes</strong>.</p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    });

    // Resend doesn't throw an error automatically if the email fails, 
    // it returns an 'error' object.
    if (error) {
      console.error("Resend API Error:", error);
      throw new Error("Failed to send OTP via Resend");
    }

    return true;

  } catch (error) {
    console.error("Error in generateAndSendOTP:", error.message);
    throw new Error("OTP Pipeline Failed");
  }
};