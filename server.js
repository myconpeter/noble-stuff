import express from "express";
import path, { dirname } from "path";
import passport from "passport";
import session from "express-session";
import flash from "connect-flash";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import initializePassport from "./config/passport.js"; // ✅ Passport config
import indexRouter from "./routes/index.routes.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import adminRouter from "./routes/admin.route.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

// --------------------- VIEW ENGINE ---------------------
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// --------------------- SESSION SETUP ---------------------
app.use(
  session({
    secret: "mycon", // You can store this in .env for production
    resave: false,
    saveUninitialized: false,
  })
);

// --------------------- PASSPORT INIT ---------------------
initializePassport(passport); // ✅ Initialize Passport strategy
app.use(passport.initialize());
app.use(passport.session());

// --------------------- MIDDLEWARE ---------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

// Flash messages setup
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Current logged-in user (for views)
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// --------------------- ROUTES ---------------------
app.get("/", (req, res) => {
  res.render("index");
});

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/secure", userRouter);
app.use("/admin", adminRouter);

// --------------------- START SERVER ---------------------
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server running on port: ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
};

startServer();
