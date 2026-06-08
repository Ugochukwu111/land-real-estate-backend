import express from "express";
import uploadListing from "../controllers/listing/uploadListing.js";
import authMiddleware from "../middleware/authMiddleware.js";
import isAdminMiddleware from "../middleware/isAdminMiddleware.js";
import uploadToCloudinary from "../middleware/uploadToCloudinary.js";

const listingRouter = express.Router();
listingRouter.post('/upload', authMiddleware, isAdminMiddleware, uploadToCloudinary.single('image'), uploadListing);

export default listingRouter;