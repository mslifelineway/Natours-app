
export class CustomError extends Error {
  status = 400

  constructor (status: number, message: string) {
    super(message)

    this.status = status

    // 👇️ because we are extending a built-in class
    Object.setPrototypeOf(this, CustomError.prototype)
  }

  getErrorMessage () {
    return 'Something went wrong: ' + this.message
  }
}
