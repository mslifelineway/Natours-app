import { Document, Model, ObjectId, Schema } from "mongoose";

export interface IReview {
  review?: string;
  rating?: number;
  createdAt?: Date;
  tour?: Schema.Types.ObjectId;
  user?: Schema.Types.ObjectId;
  model?: Model<IReviewModel>;
  prototype?: any;
}

//document
export interface IReviewDocument extends IReview, Document {
  // calcAverageRatings(review: IReviewModel, tourId: ObjectId): Promise<void>;
}

//model
export interface IReviewModel extends Model<IReviewDocument> {
  calcAverageRatings(review: IReviewModel, tourId: ObjectId): Promise<void>;
}
