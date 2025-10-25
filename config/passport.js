import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/user.model.js";

export default function initializePassport(passport) {
  // Use "email" as the username field
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });
          if (!user) {
            return done(null, false, { message: "User not found" });
          }

          // Since you're not using bcrypt, just compare directly
          if (user.password !== password) {
            return done(null, false, { message: "Incorrect password" });
          }

          if (user.suspended) {
            return done(null, false, { message: "Account not active yet" });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // Store user ID in session
  passport.serializeUser((user, done) => done(null, user.id));

  // Retrieve full user info from ID
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}
