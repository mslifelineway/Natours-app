import { Schema } from 'mongoose'
import { findByName } from './users.statics'
import { doSomething } from './users.methods'
import validator from 'validator'
import { IUserDocument } from './users.types'
import bcrypt from 'bcryptjs'

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name!']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email!']
  },

  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide the password!'],
    minlength: [8, 'Password must be at least 8 characters!']
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password!'],
    validate: {
      //this only works on .save() or .create()
      validator: function (this: IUserDocument, el: string) {
        return el === this.password //el ==> passwordConfirm value and this.password is the current document password value
      },
      message: "Password and passwordConfirm didn't match!"
    }
  }
})

//STATIC METHODS

UserSchema.statics.findByName = findByName

//MODEL OR INSTANCE METHODS

UserSchema.methods.doSomething = doSomething

//MIDDLEWARES

UserSchema.pre('save', async function (this: IUserDocument, next) {
  if (!this.isModified('password')) return next()

  //Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12)

  //delete the `passwordConfirm` or allow not to persist the in the Database
  this.passwordConfirm = undefined

  next()
})

export default UserSchema
