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
