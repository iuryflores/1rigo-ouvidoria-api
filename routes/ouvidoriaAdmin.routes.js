import { Router } from "express";
import * as dotenv from "dotenv";
import Audit from "../models/Audit.model.js";
import Ouvidoria from "../models/Ouvidoria.model.js";
dotenv.config();
const router = Router();

router.get("/admin/ouvidoria/home", async (req, res, next) => {
  try {
    const allOuvidoria = await Ouvidoria.find();
    return res.status(200).json(allOuvidoria);
  } catch (error) {
    console.log(error);
    next(error);
  }
});
router.get("/admin/ouvidoria/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const foundedOuvidoria = await Ouvidoria.find({ _id: id })
      .populate("audits")
      .populate("messages_id");

    return res.status(200).json(foundedOuvidoria);
  } catch (error) {
    next(error);
  }
});
router.get("/admin/ouvidoria", async (req, res, next) => {
  try {
    const allOuvidoria = await Ouvidoria.find();
    return res.status(200).json(allOuvidoria);
  } catch (error) {
    next(error);
  }
});
router.get("/admin/ouvidoria/status/:status", async (req, res, next) => {
  const { status } = req.params;
  console.log(status);
  try {
    const foundedDenunfoundedOuvidoriacias = await Ouvidoria.find({
      status: status,
    });
    return res.status(200).json(foundedOuvidoria);
  } catch (error) {
    console.log(error);
    next(error);
  }
});
export default router;
