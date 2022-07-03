import { Schema, Types } from "mongoose";
import { populateTourAndUser } from "./review.middlewares";
import { IReviewDocument } from "./review.types";

const reviewSchema = new Schema<IReviewDocument>(
  {
    review: {
      type: String,
      required: [true, "Review can not be empty!"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: Types.ObjectId,
      ref: "Tour",
      require: [true, "Review must belong to a tour!"],
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
      require: [true, "Review must belong to an user!"],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

//MIDDLEWARE
reviewSchema.pre(/^find/, populateTourAndUser);

export default reviewSchema;
