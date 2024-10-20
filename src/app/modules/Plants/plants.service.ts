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

// const deleteSingleProductById = async (
//   categoryName: keyof IPlantDocument,
//   plantId: string,
//   detailId: string
// ) => {
//   try {
//     const plant = await PlantModel.findOne({
//       [`${categoryName}.details._id`]: plantId,
//     });

//     if (!plant) throw new Error("Plant not found");
//     if (Array.isArray(plant[categoryName])) {
//       const category = plant[categoryName] as TCategory[];
//       const categoryItem = category.find((item) =>
//         item.details.some((detail) => detail._id.toString() === plantId)
//       );

//       if (categoryItem) {
//         categoryItem.details = categoryItem.details.filter(
//           (detail) => detail._id.toString() !== detailId
//         );
//       } else {
//         throw new Error("Category item or plant not found");
//       }
//     } else {
//       throw new Error("Category not found or not an array");
//     }
//     await plant.save();
//     return plant;
//   } catch (error) {
//     throw new Error(`Error deleting detail: ${error.message}`);
//   }
// };

//get plant by name
const getPlantsByEmailFromDB = async (name: string) => {
  const result = await PlantModel.find({ name });
  return result;
};

// Service for updating an entire plant
const updatePlant = async (id: string, plantData: Partial<IPlantDocument>) => {
  return await PlantModel.findByIdAndUpdate(id, plantData, { new: true });
};

// Service for updating a specific plant detail inside a category
const updatePlantDetail = async (
  id: string,
  categoryName: string,
  detailId: string,
  detailData: any
) => {
  const plant = await PlantModel.findById(id);
  if (!plant || !plant[categoryName]) {
    return null; // Plant or category not found
  }

  const detailIndex = plant[categoryName].findIndex((detail: any) =>
    detail._id.equals(detailId)
  );
  if (detailIndex === -1) {
    return null; // Detail not found
  }

  // Update the detail in place
  plant[categoryName][detailIndex] = {
    ...plant[categoryName][detailIndex],
    ...detailData,
  };
  await plant.save();
  return plant[categoryName][detailIndex];
};

export const PlantService = {
  createPlantDB,
  getAllPlantsFromDB,

  deletePlantDetailsInDB,
  getPlantsByEmailFromDB,
};
