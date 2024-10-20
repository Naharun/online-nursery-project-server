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
    const parsedBody = createPlantSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
        errors: parsedBody.error.errors,
      });
    }
    const plantData: TApiData = parsedBody.data;
    const categoriesToUpdate: { [key: string]: any[] } = {};
    if (plantData.flowers) {
      categoriesToUpdate.flowers = plantData.flowers;
    }
    if (plantData.gardenDecor) {
      categoriesToUpdate.gardenDecor = plantData.gardenDecor;
    }
    if (plantData.gifts) {
      categoriesToUpdate.gifts = plantData.gifts;
    }
    if (plantData.pots) {
      categoriesToUpdate.pots = plantData.pots;
    }
    if (plantData.season) {
      categoriesToUpdate.season = plantData.season;
    }
    if (plantData.seeds) {
      categoriesToUpdate.seeds = plantData.seeds;
    }

    if (Object.keys(categoriesToUpdate).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid plant categories provided",
      });
    }
    const existingCategories = await PlantModel.find({
      $or: Object.keys(categoriesToUpdate).map((category) => ({
        [category]: { $exists: true },
      })),
    });
    for (const category in categoriesToUpdate) {
      if (categoriesToUpdate.hasOwnProperty(category)) {
        if (existingCategories.some((cat) => cat[category])) {
          await PlantModel.updateOne(
            { [category]: { $exists: true } },
            {
              $addToSet: {
                [category]: { $each: categoriesToUpdate[category] },
              },
            }
          );
        } else {
          await PlantModel.create({
            [category]: categoriesToUpdate[category],
          });
        }
      }
    }
    res.status(201).json({
      success: true,
      message: "Plant data added to the appropriate categories!",
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

const createPlantDetails = async (req: Request, res: Response) => {
  try {
    const { category, name, details } = req.body;
    console.log("formValue", category, name, details);
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
    if (!Array.isArray(categoryItem.details)) {
      categoryItem.details = [];
    }
    details.forEach((detail: TPlant) => {
      const existingDetailIndex = categoryItem.details.findIndex(
        (d) => d.name === detail.name
      );

      if (existingDetailIndex !== -1) {
        categoryItem.details[existingDetailIndex] = {
          ...categoryItem.details[existingDetailIndex],
          ...detail,
        };
      } else {
        categoryItem.details.push(detail);
      }
    });
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
const deletePlant = async (req: Request, res: Response) => {
  try {
    const { category, name } = req.body;
    if (!category || !name) {
      return res
        .status(400)
        .json({ success: false, message: "Category or name is missing" });
    }

    const plant = await PlantModel.findOne({
      [`${category}.name`]: name,
    }).exec();
    if (!plant) {
      return res
        .status(404)
        .json({ success: false, message: "Plant not found" });
    }

    const updatedCategory = plant[category].filter(
      (cat: TCategory) => cat.name !== name
    );
    plant[category] = updatedCategory;

    await plant.save();
    res
      .status(200)
      .json({ success: true, message: "Plant deleted successfully!" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete plant",
      error: (err as Error).message,
    });
  }
};

// Delete a specific plant detail
const deletePlantDetail = async (req: Request, res: Response) => {
  try {
    const { category, plantName, detailName } = req.body;
    if (!category || !plantName || !detailName) {
      return res.status(400).json({
        success: false,
        message: "Missing category, plant name, or detail name",
      });
    }

    const plant = await PlantModel.findOne({
      [`${category}.name`]: plantName,
    }).exec();
    if (!plant) {
      return res
        .status(404)
        .json({ success: false, message: "Plant not found" });
    }

    const categoryData = plant[category] as TCategory[];
    const plantItem = categoryData.find((item) => item.name === plantName);

    if (!plantItem) {
      return res
        .status(404)
        .json({ success: false, message: "Plant category not found" });
    }

    plantItem.details = plantItem.details.filter(
      (detail) => detail.name !== detailName
    );
    await plant.save();

    res
      .status(200)
      .json({ success: true, message: "Detail deleted successfully!" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete plant detail",
      error: (err as Error).message,
    });
  }
};

const updatePlant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, image } = req.body; // Only updating these fields for now

    const updatedPlant = await PlantModel.findByIdAndUpdate(
      id,
      { name, image }, // You can add other fields to update here if needed
      { new: true }
    );

    if (!updatedPlant) {
      return res.status(404).json({
        success: false,
        message: "Plant not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Plant updated successfully!",
      data: updatedPlant,
    });
  } catch (err) {
    console.error("Error updating plant:", (err as Error).message);
    res.status(500).json({
      success: false,
      message: "Failed to update plant",
      error: (err as Error).message,
    });
  }
};

const updatePlantDetail = async (req: Request, res: Response) => {
  console.log("Plant ID:", req.params.id);
  console.log("Detail ID:", req.params.detailId);
  try {
    const { id, detailId } = req.params;
    const { name, image, price, add_to_cart, expected_dispatch_date } =
      req.body;

    const plant = await PlantModel.findById(id);

    if (!plant) {
      return res.status(404).json({
        success: false,
        message: "Plant not found",
      });
    }

    // Check categories one by one (flowers, gardenDecor, etc.) and find the detail
    const category =
      plant.flowers?.find((cat: TCategory) =>
        cat.details.some((detail: TPlant) => detail._id === detailId)
      ) ||
      plant.gardenDecor?.find((cat: TCategory) =>
        cat.details.some((detail: TPlant) => detail._id === detailId)
      ) ||
      plant.gifts?.find((cat: TCategory) =>
        cat.details.some((detail: TPlant) => detail._id === detailId)
      ) ||
      plant.pots?.find((cat: TCategory) =>
        cat.details.some((detail: TPlant) => detail._id === detailId)
      ) ||
      plant.season?.find((cat: TCategory) =>
        cat.details.some((detail: TPlant) => detail._id === detailId)
      ) ||
      plant.seeds?.find((cat: TCategory) =>
        cat.details.some((detail: TPlant) => detail._id === detailId)
      );

    // If no category was found, return an error
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Find the specific detail in the category
    const detail = category.details.find(
      (detail: TPlant) => detail._id === detailId
    );

    // If no detail was found, return an error
    if (!detail) {
      return res.status(404).json({
        success: false,
        message: "Detail not found",
      });
    }

    // Update the detail
    detail.name = name;
    detail.image = image;
    detail.price = price;
    detail.add_to_cart = add_to_cart;
    detail.expected_dispatch_date = expected_dispatch_date;

    await plant.save();

    res.status(200).json({
      success: true,
      message: "Plant detail updated successfully!",
      data: plant,
    });
  } catch (err) {
    console.error("Error updating plant detail:", (err as Error).message);
    res.status(500).json({
      success: false,
      message: "Failed to update plant detail",
      error: (err as Error).message,
    });
  }
};

export const PlantControllers = {
  createPlant,
  getAllPlants,
  createPlantDetails,
  deletePlant,
  deletePlantDetail,
  updatePlant,
  updatePlantDetail,
};
