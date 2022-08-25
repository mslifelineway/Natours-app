/**
 * Populate Tour and User while querying `find` related query
 */

import { IReviewDocument } from "./review.types";

export const populateTourAndUser = function (
  this: IReviewDocument,
  next: Function
) {
  /** Don't populate the Tour bcoz we will populate the reviews from tour by using virtual populate*/
  //   this.populate({
  //     path: "tour",
  //     select: "name",
  //   });
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
};

/**
 * Calculate average ratings when review is inserted, updated or deleted and then update the corresponding tour.
 */

export const calculateAverageRatings = async function (
  this: IReviewDocument,
  doc: IReviewDocument
) {
  const reviewModel = this.constructor;

  if (reviewModel && doc) {
    await reviewModel.calcAverageRatings(reviewModel, doc.tour);
  }
};
