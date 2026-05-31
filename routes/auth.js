import express from 'express';
import { registerUser } from '../controllers/registerUser.js';
import { confirmOTP,resendOTP } from '../controllers/confirmOTP.js';
export const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/confirm-otp', confirmOTP);
authRouter.post('/resend-otp', resendOTP);
