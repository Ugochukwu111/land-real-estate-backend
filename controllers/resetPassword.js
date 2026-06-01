import User from "../models/User.js";
import validator from "validator";
import bcrypt from "bcryptjs";

export default async function forgotPassword(req, res) {
  const { email, password } = req.body;
  /*=============================================
    VALIDATION
  =================================================
   */
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Email and new password are required" });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Must be a valid email" });
  }
  if (password.length <= 7) {
    return res.status(400).json({ error: "password is too short" });
  }
  if (!/[a-z]/i.test(password)) {
    return res
      .status(400)
      .json({ error: "password must contain at least an alphabet" });
  }

  console.log('passed validation')

  /**
   * =============================================
   * DATABASE LOGIC
   * =============================================
   */
  try {
        const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res.status(400).json({ error: "Email is not registered" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      existingUser.password = hashedPassword;
      await existingUser.save();
      return res.status(200).json({ 
        message: "Password reset successful",
       });
    }
  } catch (err) {
    console.error(`error resetting password, ${err.response}`);
    return res.status(500).json({ error: "Server Error try again later" });
  }
}
