// middleware/authMiddleware.js
export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next(); // ✅ User is logged in
  }

  // If this is an AJAX or API request, respond with JSON
  if (req.xhr || req.headers.accept.indexOf("json") > -1) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.flash("error_msg", "Please log in to view that resource");
  res.redirect("/auth/login");
}
