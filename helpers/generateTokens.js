import jwt from 'jsonwebtoken';

/**
 * @function generateTokens
 * @description Generates both a short-lived Access Token and a long-lived Refresh Token.
 * @param {string} userId - The unique MongoDB ID of the user.
 * @returns {Object} An object containing both tokens.
 */


export const generateTokens = (userId) => {
  
  const accessToken = jwt.sign(
    {id: userId},
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn: '50m'}
  );

  const refreshToken = jwt.sign(
    { id: userId }, 
    process.env.REFRESH_TOKEN_SECRET, 
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
}