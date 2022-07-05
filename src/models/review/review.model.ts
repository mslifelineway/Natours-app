import { model } from "mongoose";
import reviewSchema from "./review.schema";
import { IReviewDocument, IReviewModel } from "./review.types";

export const Review: IReviewModel = model<IReviewDocument>(
  "Review",
  reviewSchema
);
