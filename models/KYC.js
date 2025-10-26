import mongoose from "mongoose";

const kycSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doc_typ: { type: String, required: true },
  front_image: { type: String, required: true },
  back_image: { type: String, required: true },
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("KYC", kycSchema);
