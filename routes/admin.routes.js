import { Router } from "express";
import Complaint from "../models/Complaint.model.js";
import * as dotenv from "dotenv";
import Audit from "../models/Audit.model.js";
dotenv.config();
const router = Router();

router.get("/admin/home", async (req, res, next) => {
  try {
    const allDenuncias = await Complaint.find();
    return res.status(200).json(allDenuncias);
  } catch (error) {
    console.log(error);
    next(error);
  }
});
router.get("/admin/denuncia/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const foundedDenuncia = await Complaint.find({ _id: id })
      .populate("audits")
      .populate("messages_id");
      
    return res.status(200).json(foundedDenuncia);
  } catch (error) {
    next(error);
  }
});
router.get("/admin/denuncias", async (req, res, next) => {
  try {
    const allDenuncias2 = await Complaint.find();
    return res.status(200).json(allDenuncias2);
  } catch (error) {
    next(error);
  }
});
router.get("/admin/denuncias/status/:status", async (req, res, next) => {
  const { status } = req.params;
  try {
    const foundedDenuncias = await Complaint.find({ status: status });
    return res.status(200).json(foundedDenuncias);
  } catch (error) {
    console.log(error);
    next(error);
  }
});
export default router;
