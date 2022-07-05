import mongoose, { Types } from "mongoose";
import { ITourDocuement } from "./tour.types";

const tourSchema = new mongoose.Schema<ITourDocuement>(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      minlength: [10, "A tour name must have at least 10 characters"],
      maxlength: [40, "A tour name must have at maximum 40 characters"],
      // validate: [validator.isAlpha, 'A tour name must only contain characters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a max group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty must be either easy, medium, or difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Ratings must be above 1.0"],
      max: [5, "Ratings must be below 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    priceDiscount: {
      type: Number,
      // validate: {
      //   validator: function (val: Number) {
      //     //This only points to the current doc on new document creation, It wouldn't work on updation etc. Only creating new document it works
      //     return val < this.price
      //   },
      //   message: 'Discount price ({VALUE}) must be less than the regular price'
      // }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a summary"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: Boolean,
    price: {
      type: Number,
      required: [true, "Tour price is required"],
    },
    startLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: [Number],
        address: String,
        description: String,
      },
    ],
    guides: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export default tourSchema;
