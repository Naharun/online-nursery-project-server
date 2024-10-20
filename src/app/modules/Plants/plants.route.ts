import express from "express";
import { PlantControllers } from "./plants.controller";
const router = express.Router();

router.post("/plants", PlantControllers.createPlant);
router.get("/plants", PlantControllers.getAllPlants);
router.put("/plants/:id/details", PlantControllers.createPlantDetails);
router.delete("/plants", PlantControllers.deletePlant); // For deleting an entire plant category
router.delete("/plants/details", PlantControllers.deletePlantDetail); // For deleting a plant detail
// In route.ts
router.put("/plants/:id", PlantControllers.updatePlant); // Update an entire plant
router.put(
  "/plants/:id/category/:categoryName/details/:detailId",
  PlantControllers.updatePlantDetail
);

// router.delete(
//   "/plants/:plantId/:categoryName/details/:detailId",
//   PlantControllers.deletePlantDetails
// );
// router.delete(
//   "/plants/:plantId/:categoryName/details/:detailId",
//   async (req, res) => {
//     const { plantId, categoryName, detailId } = req.params;

//     try {
//       const updatedPlant = await PlantControllers.deleteProductDetailById(
//         plantId,
//         categoryName,
//         detailId
//       );
//       res.status(200).json(updatedPlant);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }
// );

// router.delete("/plants/:id", PlantControllers.deletePlant);
// router.delete(
//   "/plants/:plantId/details/:detailId",
//   PlantControllers.deleteDetail
// );

// router.put("/plants/:id", PlantControllers.updatePlant);
// router.put("/plants/:id/details", PlantControllers.updateDetail);

export const PlantsRoutes = router;
