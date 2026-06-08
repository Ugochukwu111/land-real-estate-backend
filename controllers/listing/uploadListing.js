import Listing from "../../models/Listing.js";

 const uploadListing = async (req, res) => {
  try {
    const { name, description, price, commissionPrice, location } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required." });
    }

   const imageUrl = req.file ? req.file.path : null;

  let documentTags = req.body.documents || [];
    if (!Array.isArray(documentTags)) {
      documentTags = [documentTags]; 
    }

    if (!name || !description || !price) {
      return res
        .status(400)
        .json({ message: "Name, description, and price are required." });
    }

    const newListing = new Listing({
      name: name,
      description: description,
      price: Number(price),
      commissionPrice: Number(commissionPrice || 0),
      legalDocuments: documentTags,
      location: location,
      image: imageUrl ,
    });

    const savedListing = await newListing.save();

    return res.status(201).json({
      message: "Listing uploaded successfully!",
      listing: savedListing,
    });
  } catch (err) {
    console.error("Listing upload error:", err);
    return res
      .status(500)
      .json({ message: "Internal server error during upload." });
  }
};

export default uploadListing;
