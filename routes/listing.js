const express = require("express");
const router = express.Router();
const multer = require("multer");
 
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

// Multer config for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Folder where files will be saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Rename file to avoid conflicts
  }
});

const upload = multer({ storage });

// ====================== ROUTES ======================

// All listings
router.get("/", wrapAsync(listingController.index));

// New listing form
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Create listing with image upload
router.post(
  "/",
  isLoggedIn,
  upload.single("listing[image]"), // This will handle single image upload
  validateListing,
  wrapAsync(listingController.createListing)
);

// Show a single listing
router.get("/:id", wrapAsync(listingController.showListing));

// Edit listing form
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// Update listing
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"), // Update image if needed
  validateListing,
  wrapAsync(listingController.updateListing)
);

// Delete listing
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;
