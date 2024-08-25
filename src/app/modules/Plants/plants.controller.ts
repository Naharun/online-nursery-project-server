import { Request, Response } from "express";
import { createPlantSchema } from "./plants.validation";
import { PlantService } from "./plants.service";

//post
const createPlant = async (req: Request, res: Response) => {
  try {
    const parsedBody = createPlantSchema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
        errors: parsedBody.error.errors,
      });
    }

    const { name, price, date } = parsedBody.data;

    const plantData = {
      name,
      price,
      date,
    };

    const result = await PlantService.createPlantDB(plantData);

    res.status(201).json({
      success: true,
      message: "Plant created successfully!",
      data: result,
    });
  } catch (err) {
    console.error("Error creating plant:", (err as Error).message);
    res.status(500).json({
      success: false,
      message: "Failed to create plant",
      error: (err as Error).message,
    });
  }
};

//get
const getAllPlants = async (req: Request, res: Response) => {
  try {
    const result = await PlantService.getAllPlantsFromDB();
    res.status(200).json({
      success: true,
      message: "Plants fetched successfully!",
      data: result,
    });
  } catch (err) {
    console.error("Error fetching orders:", (err as Error).message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch plants",
      error: (err as Error).message,
    });
  }
};

//get order by email
const getPlansByName = async (req: Request, res: Response) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name query parameter is required",
      });
    }
    const result = await PlantService.getPlantsByEmailFromDB(name as string);
    res.status(200).json({
      success: true,
      message: `Plants fetched successfully for name: ${name}`,
      data: result,
    });
  } catch (err) {
    console.error("Error fetching plants by name:", (err as Error).message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch plants by name",
      error: (err as Error).message,
    });
  }
};

export const PlantControllers = {
  createPlant,
  getAllPlants,
  getPlansByName,
};
