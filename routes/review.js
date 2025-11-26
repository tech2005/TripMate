const express = require("express");
const router = express.Router({ mergeParams: true }); 
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const reviewController = require("../controllers/reviews.js");
const { isLoggedIn } = require("../middleware.js");

// Middleware to validate review
const validateReview = (req, res, next) => {
  // Convert rating to number before validation
  if (req.body.review && req.body.review.rating) {
    req.body.review.rating = Number(req.body.review.rating);
  }

  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map(el => el.message).join(",");
    throw new ExpressError(errMsg, 400);
  } 
  next();
};

// Add Review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

// Delete Review
router.delete(
  "/:reviewId",
  isLoggedIn,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;

