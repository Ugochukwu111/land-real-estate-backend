import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email : {
    required: true,
    type: String,
  },
  otp: {
      required: true,
      type: String,
  },
  createdAt :{
    type: Date,
    default : Date.now(),
    expire: 900,
  }
})

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;