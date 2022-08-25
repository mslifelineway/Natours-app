import { Schema } from "mongoose";
import { calcAverageRatings } from "./review.methods";
import {
  calculateAverageRatings,
  populateTourAndUser,
} from "./review.middlewares";
import { IReviewDocument, IReviewModel } from "./review.types";

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

//INDEXES
reviewSchema.index({ tour: 1, user: 1 }, { unique: true }); //Since one user can write review only once on a tour

//STATIC METHODS
reviewSchema.statics.calcAverageRatings = calcAverageRatings;

//MIDDLEWARE
reviewSchema.pre(/^find/, populateTourAndUser);

reviewSchema.post("save", calculateAverageRatings);

//findByIdAndUpdate is the shorthand for findOneAndUpdate and similarly findByIdAndDelete is shorthand for findOneAndDelete
//There is no document middlewares for the findByIdAndUpdate and findByIdAndDelete but we have query middlewares
reviewSchema.pre(
  /^findOneAnd/,
  async function (this: IReviewModel, next: Function) {
    await this.clone().findOne(); //clone is used to prevent query execution already
    next();
  }
);
reviewSchema.post(/^findOneAnd/, async function (doc: IReviewDocument) {
  if (doc && doc.constructor) {
    await doc.constructor.calcAverageRatings(doc.constructor, doc.tour);
  }
});

export default reviewSchema;
