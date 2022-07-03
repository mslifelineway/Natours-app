import { model } from "mongoose";
import reviewSchema from "./review.schema";
import { IReviewDocument } from "./review.types";

export const Review = model<IReviewDocument>("Review", reviewSchema);
