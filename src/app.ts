import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { tourRouter, userRouter } from "./routes";
import { STATIC_FOLDER_PATH } from "./utils/constants";
import AppError from "./utils/AppError";
import { globalErrorHandler } from "./controllers";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";

dotenv.config({ path: "./.env" });

const app: Express = express();

//GLOBAL MIDDLEWARES - start

// API SECURITY - START //

app.use(helmet());

/**
 * Should be aloways on top middleware
 *
 * Rate Limit from same IP
 *
 * Allow 100 requests from same IP in 1 hour
 *
 * When app crashed or restarted then the limit also reset to max limit value. Means limit start from 100.
 *
 */

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, Please try again in an hour!",
});

/**
 * Apply rateLimit only to the '/api' route
 */

app.use("/api", limiter);

// API SECURITY - END //

//Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

/**
 * Body parser, reading data from body into req.body
 *
 * Limiting body data size to '10kb'
 *
 */
app.use(express.json({ limit: "10kb" }));

/**
 * Data Sanitization agains NoSQL query Injection
 *
 * It looks at the request body, request query and request params and then it's filter out all the `$` signs and `.`
 *
 */

app.use(mongoSanitize());

/**
 * Data Sanitization agains XSS (cross-site-scripting)
 *
 * It prevents the malicius html scripts or javascripts comming thourgh the request body fields
 *
 * Ex: { name: "<div id='bad-code'> Foo </div>"}, This middleware converts it into &lt;div id='bad-code'> Foo &lt;/div>
 * It allow to insert the new converted code.
 */
app.use(xss());

/**
 * Prevent parameter pollution
 *
 * if url is like (/api/tours?sort=duration&sort=price)  then there are duplicate keys 'sort'. So this middleware removes the duplication
 * and allow the value of the last filed. So this will be sorted by price. duration sort will be filtered out
 *
 * whitelist: ['duration'] ==> will allow the duration property to be duplicated in the query params
 */
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsAverage",
      "ratingsQuantity",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

//serving static files
app.use(express.static(`${STATIC_FOLDER_PATH}`));

//ROUTES MOUNTING
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

//Global middleware - end

app.all("*", (req: Request, _: Response, next: NextFunction) => {
  next(new AppError(`Couldn't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
