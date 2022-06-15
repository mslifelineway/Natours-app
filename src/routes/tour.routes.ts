import express from 'express'
import {
  createTour,
  deleteTour,
  findTourById,
  getAllTours,
  updateTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan
} from '../controllers'

export const tourRouter = express.Router()

tourRouter.route('/statics').get(getTourStats)
tourRouter.route('/monthly-plan/:year').get(getMonthlyPlan)
tourRouter
  .route('/top-cheapest')
  .get(aliasTopTours)
  .get(getAllTours)
tourRouter
  .route('/')
  .get(getAllTours)
  .post(createTour)
tourRouter
  .route('/:id')
  .get(findTourById)
  .patch(updateTour)
  .delete(deleteTour)
