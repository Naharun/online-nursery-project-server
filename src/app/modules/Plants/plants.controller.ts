import { Request, Response } from "express";
import { createPlantSchema } from "./plants.validation";
import { PlantService } from "./plants.service";
import {
  IPlantDocument,
  TApiData,
  TCategory,
  TPlant,
} from "./plants.interface";
import { PlantModel } from "./plants.model";

const createPlant = async (req: Request, res: Response) => {
  try {
    console.log("Garden Decor Data: ", req.body.flowers);
    const parsedBody = createPlantSchema.safeParse(req.body);
    console.log("Request body:", req.body);
    console.log(parsedBody.error?.errors); // Log validation errors if any

    if (!parsedBody.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
        errors: parsedBody.error.errors,
      });
    }

    const plantData: TApiData = parsedBody.data;

    // Ensure each category is processed and fits into the TCategory format
    const categories: TCategory[] = [];

    if (plantData.flowers) {
      categories.push(...plantData.flowers);
    }
    if (plantData.gardenDecor) {
      categories.push(...plantData.gardenDecor);
    }
    if (plantData.gifts) {
      categories.push(...plantData.gifts);
    }
    if (plantData.pots) {
      categories.push(...plantData.pots);
    }
    if (plantData.season) {
      categories.push(...plantData.season);
    }
    if (plantData.seeds) {
      categories.push(...plantData.seeds);
    }

    if (categories.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid plant categories provided",
      });
    }

    // Save plant data into the database using Mongoose
    const createdPlants = await PlantModel.create({
      flowers: plantData.flowers ?? [],
      gardenDecor: plantData.gardenDecor ?? [],
      gifts: plantData.gifts ?? [],
      pots: plantData.pots ?? [],
      season: plantData.season ?? [],
      seeds: plantData.seeds ?? [],
    });

    res.status(201).json({
      success: true,
      message: "Plants created successfully!",
      data: createdPlants,
    });
  } catch (err) {
    console.error("Error creating plants:", (err as Error).message);
    res.status(500).json({
      success: false,
      message: "Failed to create plants",
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

//update

// const updatePlantDetails = async (req: Request, res: Response) => {
//   try {
//     const { category, name, details } = req.body;

//     // Validate input fields
//     const validCategories: (keyof IPlantDocument)[] = [
//       "flowers",
//       "gardenDecor",
//       "gifts",
//       "pots",
//       "season",
//       "seeds",
//     ];

//     if (
//       !category ||
//       !validCategories.includes(category as keyof IPlantDocument) ||
//       !name ||
//       !details ||
//       !Array.isArray(details)
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing or invalid fields",
//       });
//     }

//     // Find the plant document based on category and name
//     const plant = (await PlantModel.findOne({
//       [`${category}.name`]: name,
//     }).exec()) as IPlantDocument | null;

//     if (!plant) {
//       return res.status(404).json({
//         success: false,
//         message: "Plant not found",
//       });
//     }

//     // Type guard to ensure `plant` is not null
//     if (plant === null) {
//       return res.status(404).json({
//         success: false,
//         message: "Plant not found",
//       });
//     }

//     // Cast category data to TCategory[] and access it safely
//     const categoryData = plant[category as keyof IPlantDocument] as
//       | TCategory[]
//       | undefined;

//     if (!categoryData) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid category",
//       });
//     }

//     // Find the specific category within the category data
//     const categoryItem = categoryData.find((item) => item.name === name);

//     if (!categoryItem) {
//       return res.status(404).json({
//         success: false,
//         message: "Plant category not found",
//       });
//     }

//     // Add or update the details in the specific category
//     details.forEach((detail: TPlant) => {
//       const existingDetailIndex = categoryItem.details.findIndex(
//         (d) => d.name === detail.name
//       );

//       if (existingDetailIndex !== -1) {
//         // Update existing detail
//         categoryItem.details[existingDetailIndex] = {
//           ...categoryItem.details[existingDetailIndex],
//           ...detail,
//         };
//       } else {
//         // Add new detail
//         categoryItem.details.push(detail);
//       }
//     });

//     // Save the updated plant
//     await (plant as any).save(); // Type assertion for save method

//     res.status(200).json({
//       success: true,
//       message: "Plant details updated successfully!",
//       data: plant,
//     });
//   } catch (err) {
//     console.error("Error updating plant details:", (err as Error).message);
//     res.status(500).json({
//       success: false,
//       message: "Failed to update plant details",
//       error: (err as Error).message,
//     });
//   }
// };

const updatePlantDetails = async (req: Request, res: Response) => {
  try {
    const { category, name, details } = req.body;

    // Validate input fields
    const validCategories: (keyof IPlantDocument)[] = [
      "flowers",
      "gardenDecor",
      "gifts",
      "pots",
      "season",
      "seeds",
    ];

    if (
      !category ||
      !validCategories.includes(category as keyof IPlantDocument) ||
      !name ||
      !details ||
      !Array.isArray(details)
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing or invalid fields",
      });
    }

    // Find the plant document based on category and name
    const plant = (await PlantModel.findOne({
      [`${category}.name`]: name,
    }).exec()) as IPlantDocument | null;

    if (!plant) {
      return res.status(404).json({
        success: false,
        message: "Plant not found",
      });
    }

    // Cast category data to TCategory[] and access it safely
    const categoryData = plant[category as keyof IPlantDocument] as
      | TCategory[]
      | undefined;

    if (!categoryData) {
      return res.status(400).json({
        success: false,
        message: "Invalid category",
      });
    }

    // Find the specific category within the category data
    const categoryItem = categoryData.find((item) => item.name === name);

    if (!categoryItem) {
      return res.status(404).json({
        success: false,
        message: "Plant category not found",
      });
    }

    // Initialize details array if not present
    if (!Array.isArray(categoryItem.details)) {
      categoryItem.details = [];
    }

    // Add or update the details in the specific category
    details.forEach((detail: TPlant) => {
      const existingDetailIndex = categoryItem.details.findIndex(
        (d) => d.name === detail.name
      );

      if (existingDetailIndex !== -1) {
        // Update existing detail
        categoryItem.details[existingDetailIndex] = {
          ...categoryItem.details[existingDetailIndex],
          ...detail,
        };
      } else {
        // Add new detail
        categoryItem.details.push(detail);
      }
    });

    // Save the updated plant
    await plant.save();

    res.status(200).json({
      success: true,
      message: "Plant details updated successfully!",
      data: plant,
    });
  } catch (err) {
    console.error("Error updating plant details:", (err as Error).message);
    res.status(500).json({
      success: false,
      message: "Failed to update plant details",
      error: (err as Error).message,
    });
  }
};


//delete
const deletePlantDetails = async (req: Request, res: Response) => {
  try {
    const { category, name, detailName } = req.body;

    const validCategories: (keyof IPlantDocument)[] = [
      "flowers",
      "gardenDecor",
      "gifts",
      "pots",
      "season",
      "seeds",
    ];

    if (
      !category ||
      !validCategories.includes(category as keyof IPlantDocument) ||
      !name ||
      !detailName
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing or invalid fields",
      });
    }

    const plant = (await PlantModel.findOne({
      [`${category}.name`]: name,
    }).exec()) as IPlantDocument | null;

    if (!plant) {
      return res.status(404).json({
        success: false,
        message: "Plant not found",
      });
    }

    const categoryData = plant[category as keyof IPlantDocument] as
      | TCategory[]
      | undefined;

    if (!categoryData) {
      return res.status(400).json({
        success: false,
        message: "Invalid category",
      });
    }

    const categoryItem = categoryData.find((item) => item.name === name);

    if (!categoryItem) {
      return res.status(404).json({
        success: false,
        message: "Plant category not found",
      });
    }

    // Remove the detail from the category
    categoryItem.details = categoryItem.details.filter(
      (detail) => detail.name !== detailName
    );

    // Save the updated plant document
    await plant.save();

    res.status(200).json({
      success: true,
      message: "Plant detail deleted successfully!",
      data: plant,
    });
  } catch (err) {
    console.error("Error deleting plant details:", (err as Error).message);
    res.status(500).json({
      success: false,
      message: "Failed to delete plant details",
      error: (err as Error).message,
    });
  }
};

//get order by name
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
  updatePlantDetails,
  deletePlantDetails,
  getPlansByName,
};
