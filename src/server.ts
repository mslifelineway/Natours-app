import app from "./app";
import mongoose from "mongoose";

const port = process.env.PORT || 8000;

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

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
