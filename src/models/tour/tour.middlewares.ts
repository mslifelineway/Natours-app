import slugify from "slugify";
import { ITourDocuement, ITourModel } from "./tour.types";

/* 1. DOCUMENT MIDDLEWARES */

/**
 * RUNS BEFORE SAVE() AND CREATE()
 *
 * @param this
 * @param next
 */

export const slugifyTourName = function (this: ITourDocuement, next: Function) {
  if (this.name) this.slug = slugify(this.name, { lower: true });
  next();
};

/**
 * PUPULATE THE GUIDES (USERS DETAILS) WHILE FETCHING THE TOURS
 *
 * @param this
 * @param next
 */

export const populateGuidesDetails = function (
  this: ITourDocuement,
  next: Function
) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChagedAt -role -active",
  });
  next();
};

/* 2. QUERY MIDDLEWARES */

/**
 * All the query start with `find`. Ex: findOne(), find(), findById(), findOneAndUpdate() etc
 *
 * @param this
 * @param next
 */

export const findNonSecretTour = function (this: ITourModel, next: Function) {
  this.find({ secretTour: { $ne: true } });
  next();
};

/**
 * All the query start with `find`. Ex: findOne(), find(), findById(), findOneAndUpdate() etc
 *
 * @param this
 * @param next
 */

export const findNonSecretTourPost = function (
  this: ITourModel,
  doc: ITourDocuement,
  next: Function
) {
  this.find({ secretTour: { $ne: true } });
  next();
};

export const queryStartTime = function (this: ITourDocuement, next: Function) {
  this.queryStartTime = Date.now();
  next();
};

export const queryEndTime = function (
  this: ITourDocuement,
  doc: ITourDocuement,
  next: Function
) {
  if (this.queryStartTime)
    console.log(`Query took ${Date.now() - this.queryStartTime} milliseconds!`);
  next();
};

/* 3. AGGREGATE MIDDLEWARE */

/**
 *
 * @param this (data type is not sure so kept any for now)
 * @param next
 *
 * Data type of this as either ITourModel or ITourDocuement is throwing error
 * Error: Property 'pipeline' does not exist on type 'Query<any, any, {}, any>' but still working will fix it later if possible
 */

export const findNonSecretTourUsingAggregate = function (
  this: any,
  next: Function
) {
  this.pipeline().unshift({
    $match: { secretTour: { $ne: true } },
  });
  next();
};
