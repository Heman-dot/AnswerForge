import mongoose from "mongoose";

const loginHistorySchema = new mongoose.Schema({
  ip: String,
  browser: String,
  os: String,
  device: String,
  loginTime: { type: Date, default: Date.now }
});

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  about: { type: String },
  tags: { type: [String] },
  joinedOn: { type: Date, default: Date.now },
  phoneNumber: { type: String }, 
  loginHistory: { type: [loginHistorySchema], default: [] }
});

export default mongoose.model("User", userSchema);
