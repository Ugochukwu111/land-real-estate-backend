import express from 'express';
import { registerUser } from '../controllers/registerUser.js';
export const authRouter = express.Router();

authRouter.post('/register', registerUser);