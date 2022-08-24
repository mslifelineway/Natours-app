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
  getMe,
  updateMe,
  deleteMe,
  getUser,
  getInactiveUsers,
  getActiveUsers,
} from "../controllers";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:resetToken", resetPassword);

//All the routers after `router.use(protect)` will be protected
router.use(protect);

router.patch("/updatePassword", updatePassword);

router.get("/me", getMe, getUser);
router.get("/inactive", getInactiveUsers, getAllUsers);
router.get("/active", getActiveUsers, getAllUsers);

router.patch("/updateMe", updateMe);
router.delete("/deleteMe", deleteMe);

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(findUserById).patch(updateUser).delete(deleteUser);

export default router;
