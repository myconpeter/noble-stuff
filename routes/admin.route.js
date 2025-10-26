import express from "express";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import KYC from "../models/KYC.js";
import { LinkedWallet } from "../models/LinkedWallet.js";

const adminRouter = express.Router();

// GET routes
adminRouter.get("/login", (req, res) => {
  res.render("admin/login");
});
adminRouter.post("/login", (req, res) => {
  console.log("Admin login attempt", req.body);

  const { password, email } = req.body;

  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    req.flash("success_msg", "Logged in as admin");
    return res.redirect("/admin/users");
  } else {
    req.flash("error_msg", "Invalid Admin Credentials");
    return res.redirect("/admin/login");
  }
});

adminRouter.get("/users", async (req, res) => {
  const users = await User.find();
  res.render("admin/users", { users });
});

// Suspend user
adminRouter.post("/users/:userId/suspend", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(userId, { suspended: true });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, message: "User suspended successfully" });
  } catch (error) {
    console.error("Suspend user error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Unsuspend user
adminRouter.post("/users/:userId/unsuspend", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(userId, { suspended: false });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, message: "User unsuspended successfully" });
  } catch (error) {
    console.error("Unsuspend user error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Delete user
adminRouter.delete("/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

adminRouter.get("/messages", async (req, res) => {
  const messages = await Message.find();
  res.render("admin/messages", { messages });
});

adminRouter.delete("/messages/:msgId", async (req, res) => {
  try {
    const { msgId } = req.params;

    const deletedMessage = await Message.findByIdAndDelete(msgId);

    if (!deletedMessage) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    res.json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    console.error("Delete message error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

adminRouter.get("/wallets", async (req, res) => {
  const wallets = await LinkedWallet.find().populate("user");
  res.render("admin/wallets", { wallets });
});

adminRouter.delete("/wallets/:walletId", async (req, res) => {
  try {
    const { walletId } = req.params;
    const deletedWallet = await LinkedWallet.findByIdAndDelete(walletId);

    if (!deletedWallet) {
      return res.status(404).json({ success: false, message: "Wallet not found" });
    }

    res.json({ success: true, message: "Wallet deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting wallet:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

adminRouter.get("/kyc", async (req, res) => {
  const kycs = await KYC.find().populate("user");
  res.render("admin/kyc", { kycs });
});

adminRouter.post("/kyc/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;

    const kyc = await KYC.findById(id).populate("user");
    if (!kyc) {
      return res.status(404).json({ success: false, message: "KYC record not found" });
    }

    if (kyc.status === "approved") {
      return res.status(400).json({ success: false, message: "KYC is already approved" });
    }

    // ✅ Update KYC status
    kyc.status = "approved";
    await kyc.save();

    // ✅ Also mark the user as verified
    if (kyc.user) {
      await User.findByIdAndUpdate(kyc.user._id, { verified: true });
    } else{
        return res.status(404).json({ success: false, message: "Associated user not found" });
    }

    res.json({ success: true, message: "KYC approved and user verified successfully" });
  } catch (error) {
    console.error("Error approving KYC:", error);
    res.status(500).json({ success: false, message: "Server error while approving KYC" });
  }
});

adminRouter.delete("/kyc/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const kyc = await KYC.findById(id);
    if (!kyc) {
      return res.status(404).json({ message: "KYC not found" });
    }

    await kyc.deleteOne();

    res.status(200).json({ message: "KYC deleted successfully" });
  } catch (err) {
    console.error("Error deleting KYC:", err);
    res.status(500).json({ message: "Server error deleting KYC" });
  }
});

export default adminRouter;
