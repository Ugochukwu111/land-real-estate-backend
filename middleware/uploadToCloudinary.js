import multer from 'multer';
import { storage } from '../utils/cloudinary.js'; 

const uploadToCloudinary = multer({ storage });

export default uploadToCloudinary;