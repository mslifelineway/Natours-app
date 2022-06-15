import { Request } from "express";
import { Query } from "mongoose";

/**
 * {query} is the model query. Ex: Tour.find() etc.
 * {queryString} is the query string coming from req. Ex. req.query
 */
export class APIFeatures {
  query: Query<any[], any, {}, any>;
  req: Request;

  constructor(query: Query<any[], any, {}, any>, req: Request) {
    this.query = query;
    this.req = req;
  }

  filter() {
    const queryObj = { ...this.req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((f: string) => delete queryObj[f]);

    const queryStr = JSON.stringify(queryObj).replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.req.query.sort && typeof this.req.query.sort === "string") {
      const sortBy: string = this.req.query.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }
  limitFields() {
    if (this.req.query.fields && typeof this.req.query.fields === "string") {
      const fields: string = this.req.query.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }
  paginate() {
    if (this.req.query.page || this.req.query.limit) {
      const page: number = this.req.query.page
        ? Number(this.req.query.page)
        : 1;
      const limit: number = this.req.query.limit
        ? Number(this.req.query.limit)
        : 3;
      const skip: number = limit * (page - 1);
      this.query = this.query.skip(skip).limit(limit);
    }
    return this;
  }
}
