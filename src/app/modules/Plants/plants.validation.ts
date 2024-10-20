import { z } from "zod";

export const plantSchema = z.object({
  name: z.string(),
  image: z.string(),
  price: z.number(),
  expected_dispatch_date: z.string(),
  add_to_cart: z.boolean(),
});

export const categorySchema = z.object({
  name: z.string(),
  image: z.string(),
  details: z.array(plantSchema).nonempty(),
});
export const createPlantSchema = z.object({
  flowers: z.array(categorySchema).optional(),
  gardenDecor: z.array(categorySchema).optional(),
  gifts: z.array(categorySchema).optional(),
  pots: z.array(categorySchema).optional(),
  season: z.array(categorySchema).optional(),
  seeds: z.array(categorySchema).optional(),
  otherCategories: z.record(z.array(categorySchema)).optional(),
});
