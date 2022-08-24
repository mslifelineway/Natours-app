import express from "express";
import {
  createTour,
  deleteTour,
  getTourById,
  getAllTours,
  updateTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
  protect,
  restrictTo,
} from "../controllers";
import reviewRouter from "./review.routes";

const router = express.Router();

router.use("/:tourId/reviews", reviewRouter);

router.route("/stats").get(getTourStats);
router
  .route("/monthly-plan/:year")
  .get(protect, restrictTo(["admin", "lead-guide", "guide"]), getMonthlyPlan);

router.route("/top-cheapest").get(aliasTopTours).get(getAllTours);
router
  .route("/")
  .get(getAllTours)
  .post(protect, restrictTo(["admin", "lead-guide"]), createTour);

router
  .route("/:id")
  .get(getTourById)
  .patch(protect, restrictTo(["admin", "lead-guide"]), updateTour)
  .delete(protect, restrictTo(["admin", "lead-guide"]), deleteTour);

export default router;
