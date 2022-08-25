import { Document, Model, ObjectId, Schema } from "mongoose";

export interface IReview {
  review?: string;
  rating?: number;
  createdAt?: Date;
  tour?: Schema.Types.ObjectId;
  user?: Schema.Types.ObjectId;

  constructor?: {
    calcAverageRatings: Function;
  };
}

//document
export interface IReviewDocument extends IReview, Document {}

//model
export interface IReviewModel extends Model<IReviewDocument> {
  clone(): IReviewModel;
  calcAverageRatings(review: IReviewModel, tourId: ObjectId): Promise<void>;
}
