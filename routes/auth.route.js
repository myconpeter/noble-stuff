import express from "express";
const authRouter = express.Router();

authRouter.get("/login", (req, res) => {
  res.render("login");
});
authRouter.get("/register", (req, res) => {
  res.render("register");
});
authRouter.get("/forget-password", (req, res) => {
  res.render("forgetPassword");
});

export default authRouter;
