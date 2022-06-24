import express from 'express'
import {
  createUser,
  deleteUser,
  findUserById,
  getAllUsers,
  updateUser,
  signUp
} from '../controllers'

export const userRouter = express.Router()

userRouter.post('/signup', signUp)
userRouter
  .route('/')
  .get(getAllUsers)
  .post(createUser)
userRouter
  .route('/:id')
  .get(findUserById)
  .patch(updateUser)
  .delete(deleteUser)
