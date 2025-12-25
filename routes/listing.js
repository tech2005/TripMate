const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudConfig.js"); // Cloudinary storage import
const upload = multer({ storage }); // Multer ko Cloudinary connect kiya

const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

// All listings
router.get("/", wrapAsync(listingController.index));

// New listing form
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Create listing (Cloudinary Upload)
router.post(
  "/",
  isLoggedIn,
  upload.single("listing[image]"), // Image ko Cloudinary bhejna
  validateListing,
  wrapAsync(listingController.createListing)
);

// Show listing
router.get("/:id", wrapAsync(listingController.showListing));

// Edit form
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// Update listing (Cloudinary Upload)
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.updateListing)
);

// Delete listing
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;