//MODEL METHODS OR INSTANCE METHODS

import { ObjectId } from "mongoose";
import { IReviewDocument, IReviewModel } from "./review.types";

//VIRTUAL METHODS

//INSTANCE METHODS

export async function calcAverageRatings(review: IReviewModel, tourId: ObjectId) {
  console.log(review, tourId, '===> methods');
  const stats = await review.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  console.log("==> stats: ", stats);
}
