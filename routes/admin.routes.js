import { Router } from "express";
import Complaint from "../models/Complaint.model.js";
import * as dotenv from "dotenv";
dotenv.config();
const router = Router();

router.get("/admin/home", async (req, res, next) => {
  try {
    const allDenuncias = await Complaint.find();
    return res.status(200).json(allDenuncias);
  } catch (error) {
    return res.status(404).json({ msg: "Não encontrado." });
  }
});
router.get("/admin/denuncia/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const foundedDenuncia = await Complaint.find({ _id: id });
    return res.status(200).json(foundedDenuncia);
  } catch (error) {
    return res.status(404).json({ msg: "Não encontrado." });
  }
});
router.get("/admin/denuncias", async (req, res, next) => {
  try {
    const allDenuncias2 = await Complaint.find();
    return res.status(200).json(allDenuncias2);
  } catch (error) {
    return res.status(404).json({ msg: "Não encontrado." });
  }
});
router.get("/admin/denuncias/status/:status", async (req, res, next) => {
  const { status } = req.params;
  console.log(status);
  try {
    const foundedDenuncias = await Complaint.find({ status: status });
    return res.status(200).json(foundedDenuncias);
  } catch (error) {
    return res.status(404).json({ msg: "Não encontrado." });
  }
});
export default router;
