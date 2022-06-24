import mongoose from 'mongoose'

const connectDatabase = async () => {
  //   let connectionString = `mongodb://admin:password@localhost:27017/db`
  const connectionString = process.env.DATABASE || ''
  await mongoose
    .connect(connectionString)
    .then(() => console.log('==> Aaw! Database connected! 🔥🌟'))
}

connectDatabase()
