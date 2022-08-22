import { Request } from "express";
import { ObjectId } from "mongoose";
import { IUserDocument } from "../models/user/users.types";

export interface IExpressRequest extends Request {
  user?: IUserDocument;
}

export interface IUserJWTToken {
  id: ObjectId;
  name: string;
  email: string;
  iat: number;
  exp: number;
}

export interface ISendEmailOptions {
  mailTo: string;
  subject: string;
  message: string;
}

export interface IPopulateOptions {
  path?: string;
  select?: string;
}
