import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import logger from "morgan";
import cors from "cors";

import complaintRoutes from "./routes/complaint.routes.js";
import userRoutes from "./routes/user.routes.js";

import "./config/db.config.js";

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());

app.use(`/`, complaintRoutes);
app.use(`/`, userRoutes);


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
