import { IReviewDocument, IReviewModel } from "./../models/review/review.types";
import { IUserDocument, IUserModel } from "./../models/user/users.types";
import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";
import { Review, User } from "../models";
import { Model } from "mongoose";

export const deleteOne = (Model: IUserModel | IReviewModel) =>
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

export const updateOne = (Model: IReviewModel) =>
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
