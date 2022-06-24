import { Document, Model } from 'mongoose'
import { IUserDocument, IUserModel } from './users.types'

// INSTANCE or MODEL methods => are call on the result of a particular Model that is on a paticular document
// Ex: const user = await User.find(); ===> this is the static
//So, user.find() ===> or do something on `user` ==> is the Instance method or method => So this code will be written here

// WHEN YOU NEED `this` AS MODEL THEN USE `Model<IUserModel>` and when you need `this` as user document then use `this: IUserDocument`

export async function doSomething (this: IUserDocument): Promise<Document[]> {
    return Model<IUserModel>.find({ name: this.name })
}
