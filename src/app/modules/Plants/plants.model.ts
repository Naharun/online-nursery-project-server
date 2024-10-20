import { Schema, model } from "mongoose";
import { IPlantDocument } from "./plants.interface";
import { number } from "zod";

const plantSchema = new Schema({
  _id: { type: String },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  expected_dispatch_date: { type: String, required: true },
  add_to_cart: { type: Boolean, required: true },
});

const categorySchema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  details: [plantSchema],
});

const plantsSchema = new Schema<IPlantDocument>(
  {
    flowers: [categorySchema],
    gardenDecor: [categorySchema],
    gifts: [categorySchema],
    pots: [categorySchema],
    season: [categorySchema],
    seeds: [categorySchema],
    otherCategories: {
      type: Map,
      of: [categorySchema],
    },
  },
  { timestamps: true }
);

export const PlantModel = model<IPlantDocument>("Plant", plantsSchema);
export { IPlantDocument };
