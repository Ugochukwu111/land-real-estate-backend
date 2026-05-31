import express from 'express';
import { registerUser } from '../controllers/registerUser.js';
import logInUser from '../controllers/logInUser.js';
import forgotPassword from '../controllers/forgotPassword.js';
import resetPassword from '../controllers/resetPassword.js';
import { confirmOTP,resendOTP } from '../controllers/confirmOTP.js';
export const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/log-in', logInUser);
authRouter.post('/confirm-otp', confirmOTP);
authRouter.post('/resend-otp', resendOTP);
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password', resetPassword);
