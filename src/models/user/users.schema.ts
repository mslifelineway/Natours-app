import { Schema } from "mongoose";
import { findByName } from "./users.statics";
import {
  checkChangedPasswordAfterTokenIssued,
  correctPassword,
  createPasswordResetToken,
} from "./users.methods";
import validator from "validator";
import { IUserDocument } from "./users.types";
import bcrypt from "bcryptjs";

const UserSchema = new Schema({
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
});

//STATIC METHODS | For testing purposes only

UserSchema.statics.findByName = findByName;

//MODEL OR INSTANCE METHODS

UserSchema.methods.correctPassword = correctPassword;
UserSchema.methods.checkChangedPasswordAfterTokenIssued =
  checkChangedPasswordAfterTokenIssued;
UserSchema.methods.createPasswordResetToken = createPasswordResetToken;

//MIDDLEWARES

/**
 * Hash the password and don't insert the passwordConfirm field before saving
 */

UserSchema.pre("save", async function (this: IUserDocument, next) {
  if (!this.isModified("password")) return next();

  //Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //delete the `passwordConfirm` or allow not to persist the in the Database
  this.passwordConfirm = undefined;

  next();
});

/**
 * update passwordChangedAt after resetting the password but before saving the new password and create new token
 */

UserSchema.pre("save", async function (this: IUserDocument, next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

export default UserSchema;
