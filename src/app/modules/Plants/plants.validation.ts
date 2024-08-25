import { z } from "zod";

export const createPlantSchema = z.object({
  name: z.string().email(),
  price: z.number().positive(),
  date: z.number().int().positive(),
});
