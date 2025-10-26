import mongoose from "mongoose";

const qPhoneSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  wallet_address: String,
  amount: Number,
  fullname: String,
  email: String,
  phone: String,
  address: String,
  proof_of_payment: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("QPhone", qPhoneSchema);
