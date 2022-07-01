import dotenv from "dotenv";
import fs from "fs";
import mongoose from "mongoose";
import Tour from "../models/tour.model";
import { TOUR_SAMPLE_JSON_PATH } from "../utils/constants";
import path from "path";

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

//IMPORT TOURS DATA INTO DATABASE
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("===> All tours data are inserted!");
    process.exit();
  } catch (error) {
    console.log(error, "==> error while importing tours");
  }
};

//DELETE ALL TOURS DATA FROM THE COLLECTIONS
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("===> All tours data deleted!");
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
