import express from "express";
import path from "path";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";
import flash from "connect-flash";
import ejs from "ejs";
import dotenv from "dotenv";

import { fileURLToPath } from "url";
import { dirname } from "path";
import connectDB from "./config/db.js";
import indexRouter from "./routes/index.routes.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
dotenv.config();

const PORT = process.env.PORT || 4000;

// view engine setup
app.set("views", path.join(__dirname, "views"));

app.set("view engine", "ejs");

// PASSPORT CONFIGURATION
app.use(
  session({
    secret: "mycon",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// req flash
app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// ROUTES
// Example route
app.get("/", (req, res) => {
  res.render("index");
});

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/secure", userRouter);

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port: ${PORT}`);
});
