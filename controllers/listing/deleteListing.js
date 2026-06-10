import Listing from "../../models/Listing.js";
import { v2 as cloudinary } from 'cloudinary';

const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found." });
    }


    if (listing.image) {
      const publicId = listing.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`listings/${publicId}`);
    }

    await Listing.findByIdAndDelete(id);

    return res.status(200).json({ message: "Listing deleted successfully." });
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export default deleteListing;