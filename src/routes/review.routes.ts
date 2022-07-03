import express from "express";
import {
  createReview,
  deleteReview,
  getATourReviews,
  protect,
  restrictTo,
} from "../controllers";

/**
 * mergeParams -> merge all the parameters comming thourgh any of the routes
 *
 * Ex: tourId --> will be comming from tour route but we want that tourId in the review route so we need to merge
 */
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getATourReviews)
  .post(protect, restrictTo(["user"]), createReview);

router.route("/:id").delete(deleteReview);

export default router;
