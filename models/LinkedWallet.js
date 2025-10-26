import mongoose from "mongoose";

const linkedWalletSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  keyid: { type: String, required: true },
  type_of_login_detail: { type: String, required: true },
  Phrase: { type: String },
  Keystore_json: { type: String },
  Private_Key: { type: String },
  password: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const LinkedWallet = mongoose.model("LinkedWallet", linkedWalletSchema);
