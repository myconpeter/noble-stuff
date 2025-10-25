import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender_name: {
      type: String,
      required: true,
      trim: true,
    },

    sender_email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    sender_subject: {
      type: String,
      required: true,
      trim: true,
    },

    sender_mssg: {
      type: String,
      required: true,
      trim: true,
    },

    read: {
      type: Boolean,
      default: false, // For admin dashboard later
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
