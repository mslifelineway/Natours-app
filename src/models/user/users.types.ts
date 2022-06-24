import { Document, Model } from 'mongoose'
export interface IUser {
  name: string
  email: string
  photo: string
  password: string
  passwordConfirm?: string | undefined
}

//DOCUMENT
export interface IUserDocument extends IUser, Document {
  doSomething: (this: IUserDocument) => Promise<Document[]>
}

//MODEL
export interface IUserModel extends Model<IUserDocument> {
  findByName: (name: string) => Promise<IUserDocument[]>
}
