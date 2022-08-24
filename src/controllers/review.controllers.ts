import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../utils/catchAsync";
import { Review } from "../models";
import { IReviewDocument } from "../models/review/review.types";
import { IExpressRequest } from "../interfaces/types";
import { IUserDocument } from "../models/user/users.types";
import AppError from "../utils/AppError";
import { createOne, deleteOne, updateOne, getAll } from "./handlerFactory";

export const checkUserAndTourIds = (
  req: IExpressRequest,
  res: Response,
  next: NextFunction
) => {
  const user: IUserDocument | undefined = req.user;
  const { tourId } = req.params;

  if (!user) {
    return next(new AppError("Please login!", 401));
  }

  if (!tourId) {
    return next(new AppError("Tour ID is required!", 400));
  }
  next();
};

/**
 * Create a review
 *
 * Only Role='user' are allowed to create a review
 */

export const prepareNewReviewData = (
  req: IExpressRequest,
  _: Response,
  next: NextFunction
) => {
  const { review, rating } = req.body;
  const user: IUserDocument | undefined = req.user;
  const tourId = req.params.tourId;
  const reviewObj = {
    review,
    rating,
    tour: tourId,
    user: user?.id,
  };
  req.body = reviewObj;
  next();
};

/**
 * Get all reviews of a tour
 *
 * url: /tours/:id/reviews
 * method: Get
 */
export const getAllReviewsByTourId = getAll(Review);
export const createReview = createOne(Review);
export const deleteReview = deleteOne(Review);
export const updateReview = updateOne(Review);
