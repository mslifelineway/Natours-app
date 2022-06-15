import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { tourRouter, userRouter } from "./routes";
import { STATIC_FOLDER_PATH } from "./utils/constants";

dotenv.config({ path: "./.env" });

const app: Express = express();

//MIDDLEWARES
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.static(`${STATIC_FOLDER_PATH}`));
app.use(express.json());

//ROUTES MOUNTING
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.get("/", (_: Request, res: Response) => {
  return res.send("Welcome dude! Now your'e connected to this api :)");
});

export default app;
