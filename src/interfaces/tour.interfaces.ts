import mongoose from "mongoose";

export interface StartLocationInterface {
  type: string;
  coordinates: number[];
  description: string;
  address: string;
}

export interface LocationInterface {
  _id: string;
  type: string;
  coordinates: number[];
  description: string;
  day: number;
}

export interface GridesInterface {
  _id: string;
  photo: string;
  role: string;
  name: string;
  email: string;
}

export interface TourInterface extends mongoose.Document {
  _id: string;
  startLocation: StartLocationInterface;
  ratingsAverage: number;
  ratingsQuantity: number;
  images: string[];
  startDates: string[];
  secretTour: boolean;
  guides: GridesInterface[];
  name: string;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  price: number;
  summary: string;
  description: string;
  imageCover: string;
  locations: LocationInterface[];
  slug: string;
  durationWeeks: number;
  reviews: [] | null;
}
