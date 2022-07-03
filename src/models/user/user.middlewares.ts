import { IUserDocument, IUserModel } from "./users.types";
import bcrypt from "bcryptjs";

/**
 * Hash the password and don't insert the passwordConfirm field before saving
 *
 * update passwordChangedAt after resetting the password but before saving the new password and create new token
 *
 * @param this
 * @param next
 * @returns
 */
export const hashPassword = async function (
  this: IUserDocument,
  next: Function
) {
  if (!this.isModified("password")) return next();

  //Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password || "", 12);

  //delete the `passwordConfirm` or allow not to persist the in the Database
  this.passwordConfirm = undefined;

  next();
};

/**
 * Update the passwordChangedAt property if document is not newly created
 * @param this
 * @param next
 * @returns
 */

export const updatePasswordChangedAt = async function (
  this: IUserDocument,
  next: Function
) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
};

/**
 * Select Only active users
 *
 * Don't allow to fetch the users with { active: true} while querying `find` related queries
 *
 * @param this
 * @param next
 */
export const selectOnlyActiveUsers = function (
  this: IUserModel,
  next: Function
) {
  this.find({ active: { $ne: false } });
  next();
};
