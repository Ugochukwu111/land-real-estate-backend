import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  name: {
    type: String, 
    required: true,
    trim: true
  },
  description: {
    type: String, 
    required: true
  },
  price: {
    type: Number, 
    required: true
  },
  commissionPrice: {
    type: Number, 
    required: true
  },
  location: {
    type: String, 
    required: true
  },
  image: {
    type: String,
    required: true
  },
  documents: [{
    type: String  
  }]
}, { 
  timestamps: true 
});

export default mongoose.model('Listing', listingSchema);