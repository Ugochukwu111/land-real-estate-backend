import User from "../models/User.js";

export default async function getMe(req, res) {
  try {
    // req.user is coming from your auth middleware (JWT decode)
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(userId).select(
      "-password -refreshToken -otp -otpExpiry"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("GET ME ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}