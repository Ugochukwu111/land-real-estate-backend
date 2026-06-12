import Listing from "../../models/Listing.js";

const updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      commissionPrice,
      location,
      documents,
    } = req.body;


    const update = { };

    if (name !== undefined) update.name = name;
    if (description !== undefined) update.description = description;
    if (price !== undefined && price !== null && price !== "")
      update.price = Number(price);
    if (
      commissionPrice !== undefined &&
      commissionPrice !== null &&
      commissionPrice !== ""
    )
      update.commissionPrice = Number(commissionPrice);
    if (location !== undefined) update.location = location;

    if (documents !== undefined) {
      let documentsArray = [];
      if (Array.isArray(documents)) documentsArray = documents;
      else
        documentsArray = String(documents)
          .split(",")
          .map((d) => d.trim())
          .filter(Boolean);

      update.documents = documentsArray;
    }

    // Prevent image updates through this endpoint
    // (ignore any image field in body)

    const updatedListing = await Listing.findByIdAndUpdate(id, update, {
      new: true,
    });

    if (!updatedListing) {
      return res.status(404).json({ message: "Listing not found." });
    }

    return res.status(200).json({
      message: "Listing updated successfully.",
      listing: updatedListing,
    });
  } catch (err) {
    console.error("Update listing error:", err);
    return res
      .status(500)
      .json({ message: "Internal server error during update." });
  }
};

export default updateListing;
