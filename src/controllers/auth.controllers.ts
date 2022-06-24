import { Request, Response } from 'express'
import { User } from '../models'
import { catchAsync } from '../utils/catchAsync'
import jwt from 'jsonwebtoken'
import AppError from '../utils/AppError'
import { IUserDocument } from '../models/user/users.types'

export const signUp = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password, passwordConfirm } = req.body
  const newUser = await User.create({ name, email, password, passwordConfirm })

  const token =
    process.env.JWT_SECRET &&
    jwt.sign(
      { id: newUser._id, name: newUser.name, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    )

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  })
})
export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password) {
    return new AppError('Please provide the email and password!', 400)
  }

  const user: IUserDocument | null = await User.findOne({ email })

  if (!user) {
    return new AppError('User did not found with provided credentials!', 400)
  }

  const token =
    process.env.JWT_SECRET &&
    jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    )

  res.status(201).json({
    status: 'success',
    token,
    data: { user }
  })
})
