import express from "express";
import {
  createUser,
  deleteUser,
  findUserById,
  getAllUsers,
  updateUser,
  signUp,
  login,
  forgotPassword,
  resetPassword,
} from "../controllers";

export const userRouter = express.Router();

userRouter.post("/signup", signUp);
userRouter.post("/login", login);

userRouter.post("/forgotPassword", forgotPassword);
userRouter.patch("/resetPassword/:resetToken", resetPassword);

userRouter.route("/").get(getAllUsers).post(createUser);
userRouter.route("/:id").get(findUserById).patch(updateUser).delete(deleteUser);
