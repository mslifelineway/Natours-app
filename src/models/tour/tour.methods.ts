/* VIRTUAL METHODS - Called while fetching data */

import { ITourDocuement } from "./tour.types";

/**
 *
 * @param this
 * @returns
 */
export const getDurationWeek = function (this: ITourDocuement) {
  if (this.duration) return this.duration / 7;
};

/**
 * Virtual populate - call it only for fetching tour by a specific tour ID
 */

export const referenceReviewModel = {
  ref: "Review", //name of the model
  foreignField: "tour", //tour -> is the property in review model
  localField: "_id", //_id is in tour model
};
