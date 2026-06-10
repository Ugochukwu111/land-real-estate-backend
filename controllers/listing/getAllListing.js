import Listing from "../../models/Listing.js";

export default async function getAllListing (req, res) {

  try{
    const listings = await Listing.find({});

    return res.status(200).json({
      success: true,
      count: Listing.length,
      data: listings.reverse(),
    });

  }catch(err){
    console.error('Error fetching Listings: ', err);
    return res.status(500).json({
      message: 'Internal server error while loading listings'
    })
  }

}