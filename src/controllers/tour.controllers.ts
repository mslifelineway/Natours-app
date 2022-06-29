import { NextFunction, Request, Response } from "express";
import { IExpressRequest } from "../interfaces/types";
import Tour from "../models/tour.model";
import { IUserDocument } from "../models/user/users.types";
import { APIFeatures } from "../utils/apiFeatures";
import AppError from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";

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

export const getAllTours = catchAsync(
  async (req: IExpressRequest, res: Response) => {
    const { query } = new APIFeatures(Tour.find(), req)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    console.log("==> req. user : ", req.user);
    const tours = await query;

    return res.status(200).json({
      status: "success",
      message: "Tours results!",
      count: tours.length,
      data: tours,
    });
  }
);

export const createTour = catchAsync(async (req: Request, res: Response) => {
  const newTour = await Tour.create(req.body);
  return res.status(201).json({
    status: "success",
    message: "Tour created successfully!",
    data: newTour,
  });
});

export const findTourById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
      return next(new AppError("No tour found with that ID", 404));
    }

    return res.status(200).json({
      status: "success",
      message: "Tour fetched successfully!",
      data: tour,
    });
  }
);

export const updateTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!tour) {
      return next(new AppError("No tour found with that ID", 404));
    }

    return res.status(200).json({
      status: "success",
      message: "Tour updated!",
      data: tour,
    });
  }
);

export const deleteTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if (!tour) {
      return next(new AppError("No tour found with that ID", 404));
    }

    return res.status(204).json({
      status: "success",
      message: "Tour deleted!",
      data: null,
    });
  }
);

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
