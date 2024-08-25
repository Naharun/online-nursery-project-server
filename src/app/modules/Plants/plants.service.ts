import { Plant } from "./plants.interface";
import PlantModel from "./plants.model";

//post
const createPlantDB = async (plantsData: Plant) => {
  const result = await PlantModel.create(plantsData);
  console.log("Plant data received in service:", plantsData);
  return result;
};

//get
const getAllPlantsFromDB = async () => {
  const result = await PlantModel.find();
  return result;
};

//get plant by name
const getPlantsByEmailFromDB = async (name: string) => {
  const result = await PlantModel.find({ name });
  return result;
};

export const PlantService = {
  createPlantDB,
  getAllPlantsFromDB,
  getPlantsByEmailFromDB,
};
