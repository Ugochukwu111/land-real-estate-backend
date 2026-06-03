import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim:true,
    lowercase: true
  },
  password : {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },

  termsAndCondition: {
    type: Boolean,
    required: true,
  },

  termsAndCondition: {
    type: Boolean,
    required: true,
  },
    isEmailVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  hasCompletedProfile: {
    type: Boolean,
    required: true,
    default: false,
  },
    role: {
    type: String,
    enum: ["admin", "associate"],
    default: "user",
  },
     rank: {
    type: String,
    required: true,
    default: "associate",
  },
});

const User = mongoose.model('User', userSchema);

export default User;