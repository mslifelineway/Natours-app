import dotenv from "dotenv";
import fs from "fs";
import mongoose from "mongoose";
import {
  REVIEWS_SAMPLE_JSON_PATH,
  TOUR_SAMPLE_JSON_PATH,
  USERS_SAMPLE_JSON_PATH,
} from "../utils/constants";
import path from "path";
import { Tour } from "../models/tour/tour.model";
import { User } from "../models/user/user.model";
import { Review } from "../models/review/review.model";

dotenv.config({ path: path.join(__dirname, "../../config.env") });

//mongo database connection
const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.DATABASE || "");
    console.log("==> Aaw! Database connected!");
  } catch (error) {
    console.log("==> Database connection error: ", error);
  }
};

connectDatabase();
//mongo database connection - end

//READ THE JSON FILE
const tours = JSON.parse(fs.readFileSync(TOUR_SAMPLE_JSON_PATH, "utf-8"));
const users = JSON.parse(fs.readFileSync(USERS_SAMPLE_JSON_PATH, "utf-8"));
const reviews = JSON.parse(fs.readFileSync(REVIEWS_SAMPLE_JSON_PATH, "utf-8"));

//IMPORT TOURS DATA INTO DATABASE
const importData = async () => {
  try {
    await User.create(users, { validateBeforeSave: false });
    await Tour.create(tours);
    await Review.create(reviews);
    console.log("===> Data are inserted!");
    process.exit();
  } catch (error) {
    console.log(error, "==> error while importing tours");
  }
};

//DELETE ALL TOURS DATA FROM THE COLLECTIONS
const deleteData = async () => {
  try {
    await Review.deleteMany();
    await Tour.deleteMany();
    await User.deleteMany();
    console.log("===> Data deleted!");
    process.exit();
  } catch (error) {
    console.log(error, "==> error while deleteing tours");
  }
};

switch (process.argv[2]) {
  case "--import":
    importData();
    break;
  case "--delete":
    deleteData();
    break;
  default:
    break;
}
