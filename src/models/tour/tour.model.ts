import { model } from "mongoose";
import tourSchema from "./tour.schema";
import { ITourDocuement, ITourModel } from "./tour.types";

export const Tour: ITourModel = model<ITourDocuement>("Tour", tourSchema);
