import express from "express";
const userRouter = express.Router();

userRouter.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

userRouter.get("/profile", (req, res) => {
  res.render("profile");
});
userRouter.get("/cards", (req, res) => {
  res.render("card");
});
userRouter.get("/phone", (req, res) => {
  res.render("phone");
});
userRouter.get("/kyc", (req, res) => {
  res.render("kyc");
});
userRouter.get("/medical", (req, res) => {
  res.render("medical");
});
userRouter.get("/contact", (req, res) => {
  res.render("contact");
});
userRouter.get("/fund", (req, res) => {
  res.render("securefund");
});
userRouter.get("/deposit", (req, res) => {
  res.render("deposit");
});
userRouter.get("/link", (req, res) => {
  res.render("linkWallet");
});
userRouter.get("/buy", (req, res) => {
  res.render("buy-crypto");
});
userRouter.get("/sidebar", (req, res) => {
  res.render("sidebar");
});
userRouter.get("/transaction", (req, res) => {
  res.render("transaction");
});

export default userRouter;
