import { NextFunction, Request, Response } from "express";
import AppError, {
  AppErrorInterface,
  MongoDbErrorsInterface,
} from "../utils/AppError";

const handleJWTExpiredError = () => {
  return new AppError("Token has expired! Please login again.", 401);
};

const handleJWTError = () => {
  return new AppError("Invalid token! Please login again.", 401);
};

const handleCastErrorDB = (err: AppErrorInterface) => {
  const message = `Invalid ${err.path} : ${err.value} `;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: AppErrorInterface) => {
  const value = err.errmsg?.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: AppErrorInterface) => {
  const mongooseErrors: MongoDbErrorsInterface | undefined = err.errors;
  if (mongooseErrors) {
    const errors = Object.values(mongooseErrors).map((el) => el?.message);
    const message: string = `Invalid input data. ${errors.join(". ")}`;
    return new AppError(message, 400);
  }
  return new AppError("Something went wrong", 400);
};

//Developement Error | Error to the developers
const sendErrorDev = (err: AppErrorInterface, res: Response) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

//Production error | Error to the clients
const sendErrorProd = (err: AppErrorInterface, res: Response) => {
  if (err.isOperational) {
    //Operational errors (Trusted errors) : send error message to the clients
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //Programming errors or unknown errors : Don't leak the error details to the clients

    //1. log the errors
    console.log("ERROR 🌟⭐✨🐍 ", err);

    //2. Send the message
    return res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

export const globalErrorHandler = (
  err: AppErrorInterface,
  _: Request,
  res: Response,
  __: NextFunction
): Response => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    return sendErrorDev(err, res);
  }

  if (process.env.NODE_ENV === "production") {
    //Handling mongo db erros
    if (err.name === "CastError") err = handleCastErrorDB(err);
    if (err.code === 11000) err = handleDuplicateFieldsDB(err);
    if (err.name === "ValidationError") err = handleValidationErrorDB(err);
    if (err.name === "JsonWebTokenError") err = handleJWTError();
    if (err.name === "TokenExpiredError") err = handleJWTExpiredError();

    return sendErrorProd(err, res);
  }

  return res.status(500).json({
    status: "error",
    error: err,
    message: "Something went very wrong!",
  });
};
