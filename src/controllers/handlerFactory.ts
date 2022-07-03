import { IReviewModel } from "./../models/review/review.types";
import { IUserModel } from "./../models/user/users.types";
import { Request, Response, NextFunction } from "express";
import { Model } from "mongoose";
import AppError from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";

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
