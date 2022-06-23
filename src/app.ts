import express, {
  ErrorRequestHandler,
  Express,
  NextFunction,
  Request,
  Response
} from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import { tourRouter, userRouter } from './routes'
import { STATIC_FOLDER_PATH } from './utils/constants'
import AppError, { AppErrorInterface } from './utils/AppError'
import { globalErrorHandler } from './controllers'

dotenv.config({ path: './.env' })

const app: Express = express()

//MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
app.use(express.static(`${STATIC_FOLDER_PATH}`))
app.use(express.json())

//ROUTES MOUNTING
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

app.all('*', (req: Request, _: Response, next: NextFunction) => {
  next(new AppError(`Couldn't find ${req.originalUrl} on this server!`, 404))
})

app.use(globalErrorHandler)

export default app
