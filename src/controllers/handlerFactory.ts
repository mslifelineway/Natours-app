import { IReviewModel } from "./../models/review/review.types";
import { IUserModel } from "./../models/user/users.types";
import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";
import { ITourModel } from "../models/tour/tour.types";
import { IPopulateOptions } from "../interfaces/types";
import { APIFeatures } from "../utils/apiFeatures";

/**
 * Create new document
 * @param Model
 * @returns
 *
 */

export const createOne = (
  Model: IUserModel | ITourModel | IReviewModel | any
) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.create(req.body);

    return res.status(201).json({
      status: "success",
      data: { data: doc },
    });
  });

/**
 * Update a document by ID
 * @param Model
 * @returns
 *
 */

export const updateOne = (
  Model: IUserModel | ITourModel | IReviewModel | any
) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc || doc === null) {
      return next(new AppError("No document found with that ID", 404));
    }

    return res.status(200).json({
      status: "success",
      data: { data: doc },
    });
  });

/**
 * Delete a document
 * @param Model
 * @returns
 *
 */

export const deleteOne = (
  Model: IUserModel | ITourModel | IReviewModel | any
) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("This docuement does not exist!", 404));
    }

    return res.status(204).json({
      status: "success",
      data: null,
    });
  });

export const getOne = (
  Model: IUserModel | ITourModel | IReviewModel | any,
  populateOptions?: IPopulateOptions
) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) {
      query = query.populate(populateOptions);
    }
    const doc = await query;
    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }
    return res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

export const getAll = (Model: IUserModel | ITourModel | IReviewModel | any) =>
  catchAsync(async (req: Request, res: Response) => {
    //To allow for nested Get reviews on tour
    const { tourId, active } = req.params;
    let filter = {};
    if (tourId) filter = { ...filter, tour: tourId };

    if (active === "false") filter = { ...filter, active: false };
    if (active === "true") filter = { ...filter, active: true };

    const { query } = new APIFeatures(Model.find(filter), req)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // const docs = await query.explain();
    const docs = await query;

    return res.status(200).json({
      status: "success",
      count: docs.length,
      data: {
        data: docs,
      },
    });
  });
