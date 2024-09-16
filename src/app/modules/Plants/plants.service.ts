import { TCategory, TPlant } from "./plants.interface";
import { IPlantDocument, PlantModel } from "./plants.model";

//post
const createPlantDB = async (plantsData: TCategory) => {
  const result = await PlantModel.create(plantsData);
  console.log("Plant data received in service:", plantsData);
  return result;
};

//get
const getAllPlantsFromDB = async () => {
  const result = await PlantModel.find();
  return result;
};

//update
// const updatePlantDetailsInDB = async (
//   plantId: string,
//   categoryName: keyof IPlantDocument, // Use keyof IPlantDocument
//   newDetails: TPlant[]
// ) => {
//   const plant = await PlantModel.findById(plantId);
//   if (!plant) throw new Error("Plant not found");

//   if (plant[categoryName] && Array.isArray(plant[categoryName])) {
//     plant[categoryName].forEach((category) => {
//       category.details.push(...newDetails);
//     });
//   } else {
//     throw new Error("Category not found");
//   }

//   return plant.save();
// };

const updatePlantDetailsInDB = async (
  plantId: string,
  categoryName: keyof IPlantDocument, // Use the specific category
  newDetails: TPlant[] // Array of new details
) => {
  const plant = await PlantModel.findById(plantId);
  if (!plant) throw new Error("Plant not found");

  // Ensure the category exists and is an array
  if (Array.isArray(plant[categoryName])) {
    const category = plant[categoryName] as TCategory[]; // Type assertion

    // Find the category item to update
    const categoryItem = category.find((item) => item.name === "Adenium"); // Adjust as needed

    if (categoryItem) {
      // Initialize details array if not present
      if (!Array.isArray(categoryItem.details)) {
        categoryItem.details = [];
      }
      categoryItem.details.push(...newDetails);
    } else {
      throw new Error("Category item not found");
    }
  } else {
    throw new Error("Category not found or not an array");
  }

  return plant.save(); // Save the updated plant
};

//delete
const deletePlantDetailsInDB = async (
  plantId: string,
  categoryName: keyof IPlantDocument,
  detailName: string
) => {
  const plant = await PlantModel.findById(plantId);
  if (!plant) throw new Error("Plant not found");

  const categoryData = plant[categoryName] as TCategory[];

  if (categoryData) {
    const categoryItem = categoryData.find((item) => item.name === detailName);
    if (categoryItem) {
      categoryItem.details = categoryItem.details.filter(
        (detail) => detail.name !== detailName
      );
    }
  } else {
    throw new Error("Category not found");
  }

  return plant.save();
};

//get plant by name
const getPlantsByEmailFromDB = async (name: string) => {
  const result = await PlantModel.find({ name });
  return result;
};

export const PlantService = {
  createPlantDB,
  getAllPlantsFromDB,
  updatePlantDetailsInDB,
  deletePlantDetailsInDB,
  getPlantsByEmailFromDB,
};
