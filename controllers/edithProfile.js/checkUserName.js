import User from '../../models/User.js';

export const checkUserName = async (req, res) => {
  console.log("Received request to check username availability:", req.query);
 try {
    const { username } = req.query; 

    if (!username) {
      return res.status(400).json({
        message: "Username is required",
      });
    }

    const existingUser = await User.findOne({
      username: username.toLowerCase(),
    });

    return res.json({
      available: !existingUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
}