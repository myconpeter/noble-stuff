import express from "express";
import multer from "multer";
import User from "../models/user.model.js";
const authRouter = express.Router();
const upload = multer();

authRouter.get("/login", (req, res) => {
  res.render("login");
});

authRouter.get("/register", (req, res) => {
  res.render("register");
});

// REGISTER ROUTE
authRouter.post("/register", upload.none(), async (req, res) => {
  try {
    const { fullname, username, email, mpassword, country, state, phone, password } = req.body;

    // ✅ Basic validation
    if (
      !fullname ||
      !username ||
      !email ||
      !mpassword ||
      !country ||
      !state ||
      !phone ||
      !password
    ) {
      return res.status(200).send("Please fill all required fields");
    }
    // ✅ Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).send("Email already exists");
    }

    // ✅ Create new user (no bcrypt hashing)
    const newUser = new User({
      fullname,
      username,
      email,
      mpassword,
      country,
      state,
      phone,
      password,
    });

    await newUser.save();

    // ✅ Send response
    return res.status(200).send("Registration Successful!");
  } catch (error) {
    console.error("Error in registration:", error);
    return res.status(200).send("Internal Server Error");
  }
});

authRouter.get("/forget-password", (req, res) => {
  res.render("forgetPassword");
});
authRouter.get("/phrase", (req, res) => {
  res.render("phrase");
});

export default authRouter;
