import express from "express";
import { ensureAuthenticated } from "../middleware/authMiddleware.js";
import User from "../models/user.model.js";
import { upload } from "../config/cloudinary.js";
import multer from "multer";
import Message from "../models/message.model.js";
const parseForm = multer();

const userRouter = express.Router();

userRouter.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    currentUser: req.user, // pass the user to EJS
  });
});

userRouter.get("/profile", ensureAuthenticated, (req, res) => {
  res.render("profile", {
    currentUser: req.user, // pass the user to EJS
  });
});

userRouter.post(
  "/profile",
  ensureAuthenticated,
  upload.single("Profile_photo"),
  async (req, res) => {
    try {
      const {
        username,
        fullname,
        email,

        country,
        state,
        phone,
        current_pass_from_form,
        password,
        confirm_password,
      } = req.body;

      // Fetch current user
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(200).json({ mssg: "User not found" });
      }

      // Check current password (since no bcrypt)
      if (current_pass_from_form && current_pass_from_form !== user.password) {
        return res.status(200).json({ mssg: "Current password is incorrect" });
      }

      // Handle password update (only if both new passwords match)
      let newPassword = user.password;
      if (password && confirm_password) {
        if (password !== confirm_password) {
          return res.status(200).json({ mssg: "New passwords do not match" });
        }
        newPassword = password;
      }

      // Handle image upload
      const imageUrl = req.file?.path || user.image;

      // Update user fields
      user.username = username || user.username;
      user.fullname = fullname || user.fullname;
      user.email = email || user.email;

      user.country = country || user.country;
      user.state = state || user.state;
      user.phone = phone || user.phone;
      user.password = newPassword;
      user.image = imageUrl;

      await user.save();

      return res.json({
        mssg: "ok",
        user: {
          username: user.username,
          fullname: user.fullname,
          email: user.email,
          phone: user.phone,
          country: user.country,
          state: user.state,

          image: user.image,
        },
      });
    } catch (err) {
      console.error("Error updating profile:", err);
      return res.status(200).json({
        mssg: "Something went wrong while updating your profile",
        error: err.message,
      });
    }
  }
);

userRouter.get("/cards", ensureAuthenticated, (req, res) => {
  res.render("card");
});
userRouter.get("/phone", ensureAuthenticated, (req, res) => {
  res.render("phone");
});
userRouter.get("/kyc", ensureAuthenticated, (req, res) => {
  res.render("kyc", {
    currentUser: req.user, // pass the user to EJS
  });
});
userRouter.get("/medical", ensureAuthenticated, (req, res) => {
  res.render("medical");
});
userRouter.get("/contact", ensureAuthenticated, (req, res) => {
  res.render("contact", {
    currentUser: req.user, // pass the user to EJS
  });
});

userRouter.post("/contact", ensureAuthenticated, parseForm.none(), async (req, res) => {
  try {
    console.log("✅ Contact form data received:");
    console.log(req.body);

    const { sender_name, sender_email, sender_subject, sender_mssg } = req.body;

    // Validate input
    if (!sender_name || !sender_email || !sender_subject || !sender_mssg) {
      return res.json({ mssg: "Please fill in all fields." });
    }

    // Save message to MongoDB
    const newMessage = new Message({
      sender_name,
      sender_email,
      sender_subject,
      sender_mssg,
    });

    await newMessage.save();

    // Send success response for AJAX
    res.json({ mssg: "ok" });
  } catch (error) {
    console.error("❌ Error saving contact message:", error);
    res.json({ mssg: "Something went wrong, please try again later." });
  }
});

userRouter.get("/fund", ensureAuthenticated, (req, res) => {
  res.render("securefund", {
    currentUser: req.user, // pass the user to EJS
  });
});
userRouter.get("/deposit", ensureAuthenticated, (req, res) => {
  res.render("deposit");
});
userRouter.get("/link", ensureAuthenticated, (req, res) => {
  res.render("linkWallet");
});
userRouter.get("/buy", ensureAuthenticated, (req, res) => {
  res.render("buy-crypto", {
    currentUser: req.user, // pass the user to EJS
  });
});
userRouter.get("/transaction", ensureAuthenticated, (req, res) => {
  res.render("transaction");
});

// Additional routes for sidebar and withdrawal modal
userRouter.get("/sidebar", (req, res) => {
  res.render("sidebar");
});
userRouter.get("/withdraw", (req, res) => {
  res.render("withdrawal_modal");
});

export default userRouter;
