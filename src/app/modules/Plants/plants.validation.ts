import { z } from "zod";

// Define plant validation schema
export const plantSchema = z.object({
  name: z.string(),
  image: z.string(),
  price: z.number(),
  expected_dispatch_date: z.string(),
  add_to_cart: z.boolean(),
});

// Define category schema
export const categorySchema = z.object({
  name: z.string(),
  image: z.string(),
  details: z.array(plantSchema).nonempty(), // Ensure at least one plant is present
});

// Define the schema for the createPlant request
export const createPlantSchema = z.object({
  flowers: z.array(categorySchema).optional(),
  gardenDecor: z.array(categorySchema).optional(),
  gifts: z.array(categorySchema).optional(),
  pots: z.array(categorySchema).optional(),
  season: z.array(categorySchema).optional(),
  seeds: z.array(categorySchema).optional(),
  otherCategories: z.record(z.array(categorySchema)).optional(),
});
