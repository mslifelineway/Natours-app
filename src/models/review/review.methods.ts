import { ObjectId } from "mongoose";
import { Tour } from "../tour/tour.model";
import { IReviewModel } from "./review.types";

//MODEL METHODS OR INSTANCE METHODS

//VIRTUAL METHODS

//STATIC METHODS

/**
 *  Calculate average ratings when review is inserted, updated or deleted and then
 *  update the ratingsQuantity and ratingsAverage into the  corresponding tour.
 */

export async function calcAverageRatings(
  review: IReviewModel,
  tourId: ObjectId
) {
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

  const newStats = {
    ratingsQuantity: stats.length > 0 ? stats[0].nRating : 0, //since default rating is 0 kept while creating new review
    ratingsAverage: stats.length > 0 ? stats[0].avgRating : 4.5, //since default rating is 4.5 kept while creating new review
  };

  await Tour.findByIdAndUpdate(tourId, newStats);
}
