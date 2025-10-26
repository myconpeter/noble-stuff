import mongoose from "mongoose";

const cardOrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    cardholdersname: String,
    card_typ: String,
    email: String,
    phone: String,
    address: String,
    wallet_address: String,
    proof_of_address: String,
  },
  { timestamps: true }
);

export default mongoose.model("CardOrder", cardOrderSchema);
