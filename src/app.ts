import express, { Request, Response } from "express";
import cors from "cors";
import { PlantsRoutes } from "./app/modules/Plants/plants.route";
import { CartRoutes } from "./app/modules/addToCart/cart.route";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});
app.use("/api", PlantsRoutes);
app.use("/api", CartRoutes);

export default app;
