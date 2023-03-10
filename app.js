import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import logger from "morgan";
import cors from "cors";

import complaintRoutes from "./routes/complaint.routes.js";
import ouvidoriaRoutes from "./routes/ouvidoria.routes.js";
import userRoutes from "./routes/user.routes.js";
import trackComplaintRoutes from "./routes/trackComplaint.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import auditRoutes from "./routes/audit.routes.js";
import messageRoutes from "./routes/message.routes.js";
import ouvidoriaAdmin from "./routes/ouvidoriaAdmin.routes.js";

import authMiddleware from "./middlewares/auth.middlewares.js";

import "./config/db.config.js";

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());

app.use(`/`, complaintRoutes);
app.use(`/`, ouvidoriaRoutes);
app.use(`/`, trackComplaintRoutes);
app.use(`/`, userRoutes);

app.use(authMiddleware);

app.use(`/`, adminRoutes);
app.use(`/`, messageRoutes);
app.use(`/`, auditRoutes);
app.use(`/`, ouvidoriaAdmin);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
