import { NextFunction, Request, Response } from "express";
import { IExpressRequest } from "../interfaces/types";
import { User } from "../models";
import { IUser, IUserDocument } from "../models/user/users.types";
import AppError from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";
import { deleteOne, updateOne } from "./handlerFactory";

/**
 * Filter out the unwanted fields that are not allowed to be updated
 * @param user
 * @param allowedFields
 * @returns
 */

const filterUserObj = (user: IUser, allowedFields: string[]): IUser => {
  const newObj: IUser = { ...user };
  Object.keys(user).forEach((field) => {
    if (!allowedFields.includes(field)) {
      newObj[field as keyof IUser] = undefined;
    }
  });
  return newObj;
};

export const getAllUsers = catchAsync(async (_: Request, res: Response) => {
  const users = await User.find({ active: { $ne: false } });
  return res.status(200).json({
    status: "success",
    message: "All active users!",
    count: users.length,
    data: { users },
  });
});

export const createUser = (req: Request, res: Response) => {
  return res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};

export const findUserById = (req: Request, res: Response) => {
  return res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};

export const updateUser = (req: Request, res: Response) => {
  return res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
// export const updateUser = updateOne(User);

export const deleteUser = deleteOne(User);

/** ACTIONS DONE BY THE USER (NOT BY ADMIN) */

/**
 * Update the current user data | Action done by user itself no by the admin.
 *
 */

export const updateMe = catchAsync(
  async (req: IExpressRequest, res: Response, next: NextFunction) => {
    const { password, passwordConfirm } = req.body;

    //1. Create an error if user trying to update the password or POSTs the password

    if (password || passwordConfirm) {
      return next(
        new AppError(
          "Password or PasswordConfirm couldn't be updated here!",
          400
        )
      );
    }

    /** WHEN YOU ARE NOT DEALING WITH PASSWORD OR PASSWORD CONFIRM THEN USE findByIdAndUpdate */
    //2. Update the user docuement
    const filterBody = filterUserObj(req.body, ["name", "email"]);
    const updatedUser: IUserDocument | null = await User.findByIdAndUpdate(
      req.user?.id,
      filterBody,
      { runValidators: true, new: true }
    );
    if (!updatedUser) {
      return next(new AppError("Account couldn't find!", 400));
    }

    return res.status(200).json({
      status: "success",
      message: "Data updated!",
      data: { updatedUser },
    });
  }
);

/**
 * DELETE ME
 */

export const deleteMe = catchAsync(
  async (req: IExpressRequest, res: Response) => {
    await User.findByIdAndUpdate(req.user?.id, { active: false });
    return res
      .status(204)
      .json({ status: "success", message: "Account deleted!" });
  }
);
