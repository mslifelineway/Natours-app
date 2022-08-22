import { NextFunction, Request, Response } from "express";
import Tour from "../models/tour.model";
import { catchAsync } from "../utils/catchAsync";
import {
  getOne,
  createOne,
  updateOne,
  deleteOne,
  getAll,
} from "./handlerFactory";

export const aliasTopTours = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  req.query.sort = "-price -ratingsAverage";
  req.query.limit = "5";
  req.query.fields = "_id, name price ratingsAverage summary";
  next();
};

export const getAllTours = getAll(Tour);

export const createTour = createOne(Tour);

export const getTourById = getOne(Tour);

export const updateTour = updateOne(Tour);

export const deleteTour = deleteOne(Tour);

export const getTourStats = catchAsync(async (req: Request, res: Response) => {
  const tours = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        numberOfTours: { $sum: 1 },
        numberOfRatings: { $sum: "$ratingQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } }
    // }
  ]);
  return res.status(200).json({
    status: "success",
    message: "Tours statics!",
    count: tours.length,
    data: tours,
  });
});

export const getMonthlyPlan = catchAsync(
  async (req: Request, res: Response) => {
    const year = req.params.year;
    const tours = await Tour.aggregate([
      {
        $unwind: "$startDates",
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numberOfToursStart: { $sum: 1 },
          tours: { $push: "$name" },
        },
      },
      {
        $addFields: { month: "$_id" },
      },
      {
        $project: { _id: 0 },
      },
      { $limit: 12 },
    ]);
    return res.status(200).json({
      status: "success",
      message: "Monthly plans!",
      count: tours.length,
      data: tours,
    });
  }
);
