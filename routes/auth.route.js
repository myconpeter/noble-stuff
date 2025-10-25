import express from "express";
import multer from "multer";
import User from "../models/user.model.js";
import passport from "passport";
const authRouter = express.Router();
const upload = multer();

authRouter.get("/login", (req, res) => {
  res.render("login");
});

authRouter.post("/login", upload.none(), (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).send("Internal Server Error");
    }

    if (!user) {
      // Handle various messages
      if (info?.message === "User not found") {
        return res.status(200).send("Invalid Email");
      }
      if (info?.message === "Incorrect password") {
        return res.status(200).send("Invalid Password");
      }
      if (info?.message === "Account not active yet") {
        return res.status(200).send("Account not active yet");
      }
      return res.status(200).send("Login Failed");
    }

    // Log user in
    req.logIn(user, (err) => {
      if (err) {
        return res.status(200).send("Login Failed");
      }

      return res.status(200).send("Login Successful!");
    });
  })(req, res, next);
});

// ✅ Check for user existence

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

// LOGOUT ROUTE
authRouter.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }

    req.flash("success_msg", "You have logged out successfully");
    res.redirect("/secure/dashboard");
  });
});

export default authRouter;
