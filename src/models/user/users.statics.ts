import { Model } from 'mongoose'
import { IUserDocument, IUserModel } from './users.types'

// INSTANCE or MODEL methods => are call on the result of a particular Model that is on a paticular document
// Ex: const user = await User.find(); ===> this is the static ===> This code will be written here
//So, user.find() ===> or do something on `user` ==> is the Instance method or method

export async function findByName (
  this: Model<IUserModel>,
  name: String
): Promise<IUserDocument[]> {
  return this.find({ name })
}
