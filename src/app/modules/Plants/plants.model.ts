import { Schema, model } from "mongoose";
import { Plant } from "./plants.interface";

const plantsSchema = new Schema<Plant>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    date: { type: Number, required: true },
  },
  { timestamps: true }
);

const PlantModel = model<Plant>("Plant", plantsSchema);

export default PlantModel;
