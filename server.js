import express from "express";
import path, { dirname } from "path";
import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo"; // 👈 ADD THIS
import flash from "connect-flash";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import initializePassport from "./config/passport.js";
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
    secret: process.env.SESSION_SECRET || "mycon", // Better to use env variable
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI_PROD || process.env.MONGO_URI_LOCAL, // 👈 ADD THIS
      touchAfter: 24 * 3600, // Lazy session update (24 hours)
      crypto: {
        secret: process.env.SESSION_SECRET || "mycon"
      }
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "lax"
    }
  })
);

// --------------------- PASSPORT INIT ---------------------
initializePassport(passport);
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