import express, { Request, Response } from "express";
import cors from "cors";
import api from "./data/api.json";

const app = express();
const port = 3000;

app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});
app.get("/api/plants", (req: Request, res: Response) => {
  res.send(api);
});
export default app;
