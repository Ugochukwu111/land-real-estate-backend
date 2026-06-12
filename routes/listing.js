import express from "express";
import uploadListing from "../controllers/listing/uploadListing.js";
import updateListing from "../controllers/listing/updateListing.js";
import getAllListing from "../controllers/listing/getAllListing.js";
import deleteListing from "../controllers/listing/deleteListing.js";
import authMiddleware from "../middleware/authMiddleware.js";
import isAdminMiddleware from "../middleware/isAdminMiddleware.js";
import uploadToCloudinary from "../middleware/uploadToCloudinary.js";


const listingRouter = express.Router();

listingRouter.post('/upload', authMiddleware, isAdminMiddleware, uploadToCloudinary.single('image'), uploadListing);
listingRouter.get('/', authMiddleware, getAllListing);
listingRouter.delete('/delete/:id', authMiddleware, isAdminMiddleware, deleteListing)
listingRouter.put('/update/:id', authMiddleware, isAdminMiddleware, updateListing)

export default listingRouter;