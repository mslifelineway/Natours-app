import { Model, Document, Types } from "mongoose";

export enum ITourStartLocationTypeEnums {
  POINT = "Point",
}

export interface ITourStartLocation {
  type?: string;
  coordinates?: [number];
  address?: string;
  description?: string;
}

export interface ITour {
  name?: string;
  slug?: string;
  duration?: number;
  maxGroupSize?: number;
  difficulty?: string;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  priceDiscount?: number;
  summary?: string;
  description?: string;
  imageCover?: string;
  images?: [string];
  createdAt?: Date;
  startDates?: [Date];
  secretTour?: Boolean;
  price?: number;
  startLocation?: ITourStartLocation;
  locations?: [ITourStartLocation];
  guides?: [Types.ObjectId];
}

export interface ITourDocuement extends ITour, Document {}

export interface ITourModel extends Model<ITourDocuement> {}
