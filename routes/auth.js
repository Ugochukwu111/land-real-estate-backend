import express from 'express';
import { registerUser } from '../controllers/registerUser.js';
import logInUser from '../controllers/logInUser.js';
import forgotPassword from '../controllers/forgotPassword.js';
import resetPassword from '../controllers/resetPassword.js';
import { confirmOTP,resendOTP } from '../controllers/confirmOTP.js';
import { checkUserName } from '../controllers/edithProfile.js/checkUserName.js';
import getMe from '../controllers/getMe.js';
import completeProfile from '../controllers/edithProfile.js/completeProfile.js';
import authMiddleware from '../middleware/authMiddleware.js';
export const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/log-in', logInUser);
authRouter.post('/confirm-otp', confirmOTP);
authRouter.post('/resend-otp', resendOTP);
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password', resetPassword);
authRouter.get('/check-username', checkUserName);
authRouter.post('/complete-profile', authMiddleware, completeProfile);
authRouter.get('/me', authMiddleware, getMe);

