const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");

// -------------------- SIGNUP (GET) --------------------
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

// -------------------- SIGNUP (POST) --------------------
router.post(
  "/signup",
  wrapAsync(async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      console.log(" Registered User:", registeredUser);

      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  })
);

// -------------------- LOGIN (GET) --------------------
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

// -------------------- LOGIN (POST) --------------------
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect("/listings");
  }
);

// -------------------- LOGOUT --------------------
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "You have logged out successfully!");
    res.redirect("/listings");
  });
});

module.exports = router;
