import { model } from "mongoose";
import reviewSchema from "./review.schema";
import { IReview, IReviewDocument, IReviewModel } from "./review.types";

export const Review = model<IReviewDocument>("Review", reviewSchema);
