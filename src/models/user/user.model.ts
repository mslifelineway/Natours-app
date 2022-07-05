import { model } from "mongoose";
import { IUserModel, IUserDocument } from "./users.types";
import UserSchema from "./users.schema";

export const User: IUserModel = model<IUserDocument>("User", UserSchema);
