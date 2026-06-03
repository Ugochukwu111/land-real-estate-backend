import User from '../../models/User.js';

export default async function completeProfile(req, res) {
  try {
    const {
      fullName,
      username,
      address,
      occupation,
      referralSource,
      marketingMode,
      visitedOffice,
    } = req.body;

    // ======================
    // STEP 1 VALIDATION
    // ======================

    if (!fullName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Full name is required",
      });
    }

    if (fullName.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "Full name is too short",
      });
    }

    if (!username?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Username is required",
      });
    }

    if (username.trim().length > 8) {
      return res.status(400).json({
        success: false,
        message: "Username is too long",
      });
    }

    if (!address?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Address is required",
      });
    }

    if (address.trim().length < 8) {
      return res.status(400).json({
        success: false,
        message: "Address is too short",
      });
    }

    if (!occupation?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Occupation is required",
      });
    }

    if (occupation.trim().length < 8) {
      return res.status(400).json({
        success: false,
        message: "Occupation is too short",
      });
    }

    // ======================
    // STEP 2 VALIDATION
    // ======================

    if (!referralSource) {
      return res.status(400).json({
        success: false,
        message: "Referral source is required",
      });
    }

    if (
      !Array.isArray(marketingMode) ||
      marketingMode.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Select at least one marketing method",
      });
    }

    if (!visitedOffice) {
      return res.status(400).json({
        success: false,
        message: "Please specify if you visited the office",
      });
    }

    // ======================
    // USERNAME CHECK
    // ======================

    const existingUser = await User.findOne({
      username: username.trim(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Username already taken",
      });
    }

    // ======================
    // UPDATE USER PROFILE
    // ======================

    const profileData = {
  fullName: fullName.trim(),
  username: username.trim(),
  address: address.trim(),
  occupation: occupation.trim(),
  referralSource,
  marketingMode,
  visitedOffice,
  hasCompletedProfile: true,
};

    const userId = req.user.id; // from auth middleware

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      profileData,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Profile completed successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}