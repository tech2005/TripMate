const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const userController = require("../controllers/users.js");   // ✅ FIXED

// SIGNUP (GET)
router.get("/signup", userController.renderSignupForm);

// SIGNUP (POST)
router.post("/signup", wrapAsync(userController.signup));

// LOGIN (GET)
router.get("/login", userController.renderLoginForm);

// LOGIN (POST)
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);

// LOGOUT
router.get("/logout", userController.logout);

module.exports = router;
