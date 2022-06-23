import mongoose from 'mongoose'
import slugify from 'slugify'
import validator from 'validator'

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      minlength: [10, 'A tour name must have at least 10 characters'],
      maxlength: [40, 'A tour name must have at maximum 40 characters'],
      // validate: [validator.isAlpha, 'A tour name must only contain characters']
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
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must be either easy, medium, or difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Ratings must be above 1.0'],
      max: [5, 'Ratings must be below 5.0']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    priceDiscount: {
      type: Number,
      // validate: {
      //   validator: function (val: Number) {
      //     //This only points to the current doc on new document creation, It wouldn't work on updation etc. Only creating new document it works
      //     return val < this.price
      //   },
      //   message: 'Discount price ({VALUE}) must be less than the regular price'
      // }
    },
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
tourSchema.post('save', function (docs, next) {
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

//AGGREGATE MIDDLEWARE,
//Error : Property 'pipeline' does not exist on type 'Query<any, any, {}, any>' but still working will fix it later if possible
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({
//     $match: { secretTour: { $ne: true } }
//   })
//   // console.log('====> aggregate: ', this.pipeline())
//   next()
// })

const Tour = mongoose.model('Tour', tourSchema)

export default Tour
