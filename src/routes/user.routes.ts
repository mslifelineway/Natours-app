import { protect, updatePassword } from "./../controllers/auth.controllers";
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
  updateMe,
} from "../controllers";

export const userRouter = express.Router();

userRouter.post("/signup", signUp);
userRouter.post("/login", login);

userRouter.post("/forgotPassword", forgotPassword);
userRouter.patch("/resetPassword/:resetToken", resetPassword);
userRouter.patch("/updatePassword", protect, updatePassword);

userRouter.patch("/updateMe", protect, updateMe);

userRouter.route("/").get(getAllUsers).post(createUser);
userRouter.route("/:id").get(findUserById).patch(updateUser).delete(deleteUser);
