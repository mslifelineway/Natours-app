import { Document, Model, Types } from "mongoose";
export interface IUser {
  name?: string;
  email?: string;
  photo?: string;
  password?: string;
  passwordConfirm?: string | undefined;
  passwordChangedAt?: Date;
  role?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  active?: boolean;
  guides?: [Types.ObjectId];
}

//DOCUMENT - INSTANCE METHODS
export interface IUserDocument extends IUser, Document {
  correctPassword: (
    providedPassword: string,
    documentPassword: string
  ) => Promise<Boolean>;
  checkChangedPasswordAfterTokenIssued: (JWTTimestamp: number) => Boolean;
  createPasswordResetToken: () => Boolean;
}

//MODEL
export interface IUserModel extends Model<IUserDocument> {}
