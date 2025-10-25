import express from "express";
import path, { dirname } from "path";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";
import flash from "connect-flash";
import ejs from "ejs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import indexRouter from "./routes/index.routes.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Sessions
app.use(
  session({
    secret: "mycon",
    resave: false,
    saveUninitialized: false,
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Body parsers ✅ (clean version)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Flash messages
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Current user
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/secure", userRouter);

// Start server
app.listen(PORT, async () => {
  await connectDB();
  console.log(`✅ Server running on port: ${PORT}`);
});
