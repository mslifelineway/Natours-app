import { Schema } from "mongoose";
import {
  checkChangedPasswordAfterTokenIssued,
  correctPassword,
  createPasswordResetToken,
} from "./users.methods";
import validator from "validator";
import { IUserDocument } from "./users.types";
import { hashPassword, updatePasswordChangedAt } from "./user.middlewares";

const UserSchema = new Schema<IUserDocument>({
  name: {
    type: String,
    required: [true, "Please provide your name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email!"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email!"],
  },
  photo: String,
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provide the password!"],
    minlength: [8, "Password must be at least 8 characters!"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password!"],
    validate: {
      //this only works on .save() or .create()
      validator: function (this: IUserDocument, el: string) {
        return el === this.password; //el ==> passwordConfirm value and this.password is the current document password value
      },
      message: "Password and confirm password didn't match!",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
  },
});

//INSTANCE METHODS

UserSchema.methods.correctPassword = correctPassword;
UserSchema.methods.checkChangedPasswordAfterTokenIssued =
  checkChangedPasswordAfterTokenIssued;
UserSchema.methods.createPasswordResetToken = createPasswordResetToken;

//MIDDLEWARES

UserSchema.pre("save", hashPassword);
UserSchema.pre("save", updatePasswordChangedAt);
// UserSchema.pre(/^find/, selectOnlyActiveUsers);

export default UserSchema;
