import { getAll } from "./../../controllers/handlerFactory";
import { Model, Schema } from "mongoose";
import { calcAverageRatings } from "./review.methods";
import { populateTourAndUser } from "./review.middlewares";
import { IReview, IReviewDocument, IReviewModel } from "./review.types";
import { Review } from "./review.model";

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
      type: Schema.Types.ObjectId,
      ref: "Tour",
      require: [true, "Review must belong to a tour!"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: [true, "Review must belong to an user!"],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

//MIDDLEWARE
reviewSchema.pre(/^find/, populateTourAndUser);

//STATIC METHODS
reviewSchema.statics.calcAverageRatings = calcAverageRatings;

/**
 * PENDING FOR NOW
 * TODO: Need to check how can we get access to calcAverageRatings so we can call this.constructor.calcAverageRatings()
 */
reviewSchema.post(
  "save",
  async function (this: IReviewDocument, doc: IReviewDocument) {
    console.log("doc: ", doc);
    const cons = this.constructor;
    // const calc = cons.calcAverageRatings();
    // console.log(cons, calc);
    console.log("===> testing...");
  }
);

export default reviewSchema;
