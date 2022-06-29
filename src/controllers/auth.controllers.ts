import { NextFunction, Request, Response } from "express";
import { User } from "../models";
import { catchAsync } from "../utils/catchAsync";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError";
import { IUserDocument } from "../models/user/users.types";
import { promisify } from "util";
import {
  IExpressRequest,
  ISendEmailOptions,
  IUserJWTToken,
} from "../interfaces/types";
import { sendEmail } from "../utils/email";
import crypto from "crypto";

/**
 * Sign Token | Create a new token
 *
 */

const signToken = (user: IUserDocument) => {
  const payload = {
    id: user._id,
    name: user.name,
    email: user.email,
  };
  return (
    process.env.JWT_SECRET &&
    jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    })
  );
};

const createTokenAndSendResponse = (
  user: IUserDocument,
  statusCode: number,
  res: Response,
  message?: string,
  payload?: any
) => {
  const token = signToken(user);

  return res.status(statusCode).json({
    status: "success",
    message,
    token,
    data: payload,
  });
};

/**
 * Sign Up
 *
 */

export const signUp = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password, passwordConfirm, passwordChangedAt, role } =
    req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    passwordChangedAt,
    role,
  });

  res.status(201).json({
    status: "success",
    // token: signToken(newUser),
    data: {
      user: newUser,
    },
  });
});

/**
 * Login
 *
 */

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError("Please provide the email and password!", 400));
    }

    const user: IUserDocument | null = await User.findOne({ email }).select(
      "+password"
    );

    if (!user || !(await user.correctPassword(password, user.password || ""))) {
      return next(new AppError("Incorrect email or password!", 400));
    }

    createTokenAndSendResponse(user, 200, res, "Logged in successfully!");
  }
);

/**
 * Protect route | Authenticate the client
 *
 * - Check whether client is logged in or not
 *
 */

export const protect = catchAsync(
  async (req: IExpressRequest, res: Response, next: NextFunction) => {
    let token;
    //1. Check token exists in authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(
        new AppError("You are not logged in! Please login to get access.", 401)
      );
    }
    //2. Verification of token
    const promise = promisify<string, string>(jwt.verify);
    const decoded = await promise(token, process.env.JWT_SECRET || "");
    const tokenPayload: IUserJWTToken = JSON.parse(JSON.stringify(decoded));
    if (!tokenPayload) {
      return next(
        new AppError("You are not logged in! Please login to get access.", 401)
      );
    }
    //3. Check token is expired or not
    const freshUser = await User.findById(tokenPayload.id);
    if (!freshUser) {
      return next(
        new AppError(
          "The user belonging to this token is no longer exists!",
          400
        )
      );
    }
    //4. Check whether user changed the password after issuing the JWT with previous login activity
    if (freshUser.checkChangedPasswordAfterTokenIssued(tokenPayload.iat)) {
      return next(
        new AppError("Password has changed recently! Please login again.", 401)
      );
    }
    //GRANT ACCESS TO PROTECTED ROUTE
    req.user = freshUser;
    next();
  }
);

/**
 * Authorization | restrictTo
 *
 * - Check the client has permission to access or not
 *
 * @Params(roles)
 *
 * Allowed Roles: 'admin', 'lead-guide'
 *
 * Only allowed roles can have access
 *
 */
export const restrictTo = (roles: string[]) => {
  return (req: IExpressRequest, _: Response, next: NextFunction) => {
    const loggedInUser: IUserDocument | undefined = req.user;
    if (!loggedInUser) {
      return next(
        new AppError("You are not logged in! Please login again.", 401)
      );
    }
    if (!roles.includes(loggedInUser.role || "")) {
      return next(
        new AppError("You don't have permission to perform this action!", 403)
      ); //forbidden = 403
    }
    next();
  };
};

export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.email) {
      return next(new AppError("Please provide a valid email!", 400));
    }

    //1. Get the client detils by posted email

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError("Account doesn't exists with this email!", 404));
    }

    //2. Generate the random reset token

    const resetToken = user.createPasswordResetToken();
    user.save({ validateBeforeSave: false });

    //3. Send it to client's email

    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\n 
    If You didn't forget your password, please ignore this email!`;

    const emailOptions: ISendEmailOptions = {
      mailTo: user.email || "",
      subject: "Your password reset token (valid for 10 minutes)",
      message,
    };

    try {
      await sendEmail(emailOptions);

      res.status(200).json({
        status: "success",
        message: "Token sent to your email address!",
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;

      user.save({ validateBeforeSave: false });

      return next(
        new AppError(
          "There was an error sending the email. Please try again later!",
          500
        )
      );
    }
  }
);

export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { resetToken } = req.params;
    if (!resetToken) {
      return next(new AppError("Inavlid access! Reset token is missing!", 400));
    }

    /**
     * 1. Encrypt the resetToken and find the user by that and passwordResetExpires should be greter than the current time
     */
    const encryptedResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user: IUserDocument | null = await User.findOne({
      passwordResetToken: encryptedResetToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    /**
     * 2. If token has not expired and there is an user, set the new password
     */
    if (!user) {
      return next(new AppError("Token is not valid or has expired!", 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    /**
     * 3. Update passwordChangedAt property
     *
     * This will be taken from the middleware
     */

    /**
     * 4. Login the user and sent JWT
     */

    createTokenAndSendResponse(
      user,
      200,
      res,
      "Password resetted successfully!"
    );
  }
);

/**
 * UPDATE THE PASSWORD
 *
 * Only logged in users are allowed to update the password
 *
 */

export const updatePassword = catchAsync(
  async (req: IExpressRequest, res: Response, next: NextFunction) => {
    const { currentPassword, newPassword, passwordConfirm } = req.body;
    if (!currentPassword || !newPassword || !passwordConfirm) {
      return next(
        new AppError(
          "Please provide the current password, new password and passwordConfirm.",
          400
        )
      );
    }

    if (!req.user) {
      return next(
        new AppError(
          "It seems like you are not logged in. Please login and try again!",
          400
        )
      );
    }

    /**
     * 1. Get the user by POSTed email
     */

    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      return next(new AppError("No user belongs to this email!", 400));
    }

    /**
     * 2. Check if POSTed current pasword is correct
     */

    if (!(await user.correctPassword(currentPassword, user.password || ""))) {
      return next(new AppError("Your current password is incorrect!", 401));
    }

    /**
     * 3. If yes, update the password
     */

    user.password = newPassword;
    user.passwordConfirm = passwordConfirm;
    await user.save();

    /**
     * 4. Login the user and send new JWT
     */

    createTokenAndSendResponse(
      user,
      200,
      res,
      "Password updated successfully!"
    );
  }
);
