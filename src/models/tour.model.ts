import { NextFunction } from 'express'
import mongoose from 'mongoose'
import slugify from 'slugify'

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a max group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty']
    },
    ratingsAverage: {
      type: Number,
      default: 4.5
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    secretTour: Boolean,
    guides: [
      {
        photo: String,
        role: String,
        name: String,
        email: String
      }
    ],
    price: {
      type: Number,
      required: [true, 'Tour price is required']
    },
    reviews: []
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

//virtual properties
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7
})

//DOCUMENT MIDDLEWARE: RUNS BEFORE SAVE() AND CREATE()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true })
  next()
})

//DOCUMENT MIDDLEWARE: RUNS AFTER SAVE() AND CREATE()
tourSchema.post('save', function (next) {
  next()
})

//QUERY MIDDLEWARE: RUNS only for find() method
// tourSchema.post('find', function (next) {
//   this.find({ secretTour: { $ne: true } })
//   next()
// })

//QUERY MIDDLEWARE: all the query start with `find`. Ex: findOne(), find(), findById(), findOneAndUpdate() etc
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } })
  next()
})
//QUERY MIDDLEWARE: all the query start with `find`. Ex: findOne(), find(), findById(), findOneAndUpdate() etc
tourSchema.post(/^find/, function (docs, next) {
  this.find({ secretTour: { $ne: true } })
  next()
})

const Tour = mongoose.model('Tour', tourSchema)

export default Tour
