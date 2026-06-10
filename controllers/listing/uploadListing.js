import Listing from "../../models/Listing.js";

const uploadListing = async (req, res) => {
  try {
    const { name, description, price, commissionPrice, location, documents } =
      req.body;

    console.log(name, description, price, commissionPrice, location, documents);

    let documentsArray = [];

    if (documents) {
      documentsArray = documents
        .split(",") 
        .map((doc) => doc.trim()); 
    }
    console.log(documentsArray)

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

    if(!location){
            return res
        .status(400)
        .json({ message: "Location is required" });
    }

    const newListing = new Listing({
      name: name,
      description: description,
      price: Number(price),
      commissionPrice: Number(commissionPrice || 0),
      legalDocuments: documentTags,
      location: location,
      image: imageUrl,
      documents: documentsArray,
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
