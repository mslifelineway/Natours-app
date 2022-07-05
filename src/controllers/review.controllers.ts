import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../utils/catchAsync";
import { Review } from "../models";
import { IReviewDocument } from "../models/review/review.types";
import { IExpressRequest } from "../interfaces/types";
import { IUserDocument } from "../models/user/users.types";
import AppError from "../utils/AppError";
import { deleteOne, updateOne } from "./handlerFactory";

/**
 * Get all reviews of a tour
 *
 * url: /tours/:id/reviews
 * method: Get
 */
export const getATourReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tourId = req.params.id;
    if (!tourId) {
      return next(new AppError("Tour ID is required to get the reviews!", 400));
    }

    const reviews: IReviewDocument[] = await Review.find({ tour: tourId });

    return res.status(200).json({
      status: "success",
      message: "Reviews data!",
      count: reviews.length,
      data: {
        reviews,
      },
    });
  }
);

/**
 * Create a review
 *
 * Only Role='user' are allowed to create a review
 */

export const createReview = catchAsync(
  async (req: IExpressRequest, res: Response, next: NextFunction) => {
    const { review, rating } = req.body;
    const user: IUserDocument | undefined = req.user;
    const tourId = req.params.id;

    if (!tourId) {
      return next(new AppError("Tour ID is required!", 400));
    }
    if (!user) {
      return next(new AppError("Please login!", 401));
    }

    const reviewObj = {
      review,
      rating,
      tour: tourId,
      user: user.id,
    };
    const newReview: IReviewDocument = await Review.create(reviewObj);

    return res.status(201).json({
      status: "success",
      message: "Review created successfully!",
      data: {
        newReview,
      },
    });
  }
);

/**
 * Delete a review
 */

export const deleteReview = deleteOne(Review);
export const updateReview = updateOne(Review);
