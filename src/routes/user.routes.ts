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
  deleteMe,
} from "../controllers";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);

router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:resetToken", resetPassword);
router.patch("/updatePassword", protect, updatePassword);

router.patch("/updateMe", protect, updateMe);
router.delete("/deleteMe", protect, deleteMe);

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(findUserById).patch(updateUser).delete(deleteUser);

export default router;
