import express from "express";
import { PlantControllers } from "./plants.controller";
const router = express.Router();

//router

router.post("/plants", PlantControllers.createPlant);
router.get("/plants", PlantControllers.getAllPlants);
router.put("/plants/:id/details", PlantControllers.updatePlantDetails);
router.delete("/plants/:id/details", PlantControllers.deletePlantDetails);
router.get("/plants/:name", PlantControllers.getPlansByName);

export const PlantsRoutes = router;
