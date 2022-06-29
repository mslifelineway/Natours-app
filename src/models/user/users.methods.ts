import bcrypt from "bcryptjs";
import { IUserDocument } from "./users.types";
import crypto from "crypto";

/**
 * It compare the password entered by the user and existing password in the document of that user
 * @param providedPassword
 * @param documentPassword
 * @returns
 */

export async function correctPassword(
  providedPassword: string,
  documentPassword: string
) {
  return await bcrypt.compare(providedPassword, documentPassword);
}

export function checkChangedPasswordAfterTokenIssued(
  this: IUserDocument,
  JWTTimestamp: number
): boolean {
  if (this.passwordChangedAt) {
    const changedPasswordTimestamp = this.passwordChangedAt.getTime() / 1000;
    return JWTTimestamp < changedPasswordTimestamp; //true => changed
  }
  return false; //false => not changed
}

/**
 * Create Reset Password Token After clicking on forgot password
 *  returns {resetToken}
 */
export function createPasswordResetToken(this: IUserDocument): string {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  /**
   * Reset password will be expired after 10 minutes of creation
   *
   * adding 10 minutes to current date
   */
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 10000);
  return resetToken;
}
