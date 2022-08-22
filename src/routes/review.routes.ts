import express from "express";
import {
  createReview,
  deleteReview,
  getAllReviewsByTourId,
  protect,
  restrictTo,
  updateReview,
  checkUserAndTourIds,
  prepareNewReviewData
} from "../controllers";

/**
 * mergeParams -> merge all the parameters comming thourgh any of the routes
 *
 * Ex: tourId --> will be comming from tour route but we want that tourId in the review route so we need to merge
 */
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getAllReviewsByTourId)
  .post(protect, restrictTo(["user"]), checkUserAndTourIds, prepareNewReviewData, createReview);

router.route("/:id").patch(updateReview).delete(deleteReview);

export default router;
