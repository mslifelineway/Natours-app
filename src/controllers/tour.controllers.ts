import { NextFunction, Request, Response } from 'express'
import Tour from '../models/tour.model'
import { APIFeatures } from '../utils/apiFeatures'

export const aliasTopTours = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  req.query.sort = '-price -ratingsAverage'
  req.query.limit = '5'
  req.query.fields = '_id, name price ratingsAverage summary'
  next()
}

export const getAllTours = async (req: Request, res: Response) => {
  try {
    const { query } = new APIFeatures(Tour.find(), req)
      .filter()
      .sort()
      .limitFields()
      .paginate()

    const tours = await query

    return res.status(200).json({
      status: 'success',
      message: 'Tours results!',
      count: tours.length,
      data: tours
    })
  } catch (error) {
    return res.status(404).json({
      status: 'fail',
      message: error
    })
  }
}

export const createTour = async (req: Request, res: Response) => {
  try {
    const newTour = await Tour.create(req.body)
    return res.status(201).json({
      status: 'success',
      message: 'Tour created successfully!',
      data: newTour
    })
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      message: error
    })
  }
}

export const findTourById = async (req: Request, res: Response) => {
  try {
    const tour = await Tour.findById(req.params.id)
    return res.status(200).json({
      status: 'success',
      message: 'All tours fetched successfully!',
      data: tour
    })
  } catch (error) {
    return res.status(404).json({
      status: 'fail',
      message: error
    })
  }
}

export const updateTour = async (req: Request, res: Response) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    return res.status(200).json({
      status: 'success',
      message: 'Tour updated!',
      data: tour
    })
  } catch (error) {
    return res.status(404).json({
      status: 'fail',
      message: error
    })
  }
}

export const deleteTour = async (req: Request, res: Response) => {
  try {
    await Tour.findByIdAndDelete(req.params.id)
    return res.status(204).json({
      status: 'success',
      message: 'Tour deleted!',
      data: null
    })
  } catch (error) {
    return res.status(404).json({
      status: 'fail',
      message: error
    })
  }
}

export const getTourStats = async (req: Request, res: Response) => {
  try {
    const tours = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4 } }
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numberOfTours: { $sum: 1 },
          numberOfRatings: { $sum: '$ratingQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      {
        $sort: { avgPrice: 1 }
      }
      // {
      //   $match: { _id: { $ne: 'EASY' } }
      // }
    ])
    return res.status(200).json({
      status: 'success',
      message: 'Tours statics!',
      count: tours.length,
      data: tours
    })
  } catch (error) {
    return res.status(404).json({
      status: 'fail',
      message: error
    })
  }
}

export const getMonthlyPlan = async (req: Request, res: Response) => {
  const year = req.params.year
  console.log('=== date: ', new Date(`${year}-01-01`), year, req.params)
  try {
    const tours = await Tour.aggregate([
      {
        $unwind: '$startDates'
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numberOfToursStart: { $sum: 1 },
          tours: { $push: '$name' }
        }
      },
      {
        $addFields: { month: '$_id' }
      },
      {
        $project: { _id: 0 }
      },
      { $limit: 12 }
    ])
    return res.status(200).json({
      status: 'success',
      message: 'Monthly plans!',
      count: tours.length,
      data: tours
    })
  } catch (error) {
    return res.status(404).json({
      status: 'fail',
      message: error
    })
  }
}
