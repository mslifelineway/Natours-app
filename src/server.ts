process.on('uncaughtException', (err: Error) => {
  console.log('UNCAUGHT EXCEPTION ⭐🌟🔥 SHUTTING DOWN...')
  console.log(err)
})

import app from './app'
import './mongoose.connection'

const port = process.env.PORT || 8000

const server = app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`)
})

process.on('unhandledRejection', (err: Error) => {
  console.log('UNHANDLED REJECTION ⭐🌟🔥 SHUTTING DOWN...')
  console.log(err.name, err.message)
  server.close(() => {
    process.exit(1) //0 => success, 1 => uncaught exception
  })
})
