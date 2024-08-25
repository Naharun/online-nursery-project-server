import express from "express";
import { PlantControllers } from "./plants.controller";
const router = express.Router();

//router

router.post("/plants", PlantControllers.createPlant);
router.get("/plants", PlantControllers.getAllPlants);
router.get("/plants", PlantControllers.getPlansByName);

export const OrderRoutes = router;
