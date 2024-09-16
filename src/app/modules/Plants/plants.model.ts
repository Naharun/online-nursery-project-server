// import { Schema, model } from "mongoose";
// import { TCategory } from "./plants.interface";
// const categorySchema = new Schema<TCategory>({
//   name: { type: String, required: true },
//   image: { type: String, required: true },
//   details: [
//     {
//       name: { type: String, required: true },
//       image: { type: String, required: true },
//       price: { type: Number, required: true },
//       expected_dispatch_date: { type: String, required: true },
//       add_to_cart: { type: Boolean, required: true },
//     },
//   ],
// });

// const plantsSchema = new Schema(
//   {
//     flowers: [categorySchema],
//     gardenDecor: [categorySchema],
//     gifts: [categorySchema],
//     pots: [categorySchema],
//     season: [categorySchema],
//     seeds: [categorySchema],
//     // Add other categories here if needed
//   },
//   { timestamps: true }
// );

// export const PlantModel = model("Plant", plantsSchema);
// console.log("Created Plants: ", plantsSchema);

import { Schema, model } from "mongoose";
import { IPlantDocument } from "./plants.interface";

const plantSchema = new Schema({
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

// Main plant schema with dynamic categories support
const plantsSchema = new Schema<IPlantDocument>(
  {
    flowers: [categorySchema],
    gardenDecor: [categorySchema],
    gifts: [categorySchema],
    pots: [categorySchema],
    season: [categorySchema],
    seeds: [categorySchema],
    // Handle dynamic categories using Map
    otherCategories: {
      type: Map,
      of: [categorySchema],
    },
  },
  { timestamps: true }
);

export const PlantModel = model<IPlantDocument>("Plant", plantsSchema);
export { IPlantDocument };
