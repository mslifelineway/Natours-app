import { Request, Response } from "express";

export const getAllUsers = (_: Request, res: Response) => {
  return res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};

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

export const deleteUser = (req: Request, res: Response) => {
  return res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
