import { Document, Model, Types } from "mongoose";

export interface IReview {
  review?: string;
  rating?: number;
  createdAt?: Date;
  tour?: Types.ObjectId;
  user?: Types.ObjectId;
}

//document
export interface IReviewDocument extends IReview, Document {}

//model
export interface IReviewModel extends Model<IReviewDocument> {}
