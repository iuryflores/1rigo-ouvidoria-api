import { Router } from "express";
import Complaint from "../models/Complaint.model.js";

const router = Router();

//Get all complaint
router.get("/", async (req, res, next) => {
  try {
    const allComplaint = await Complaint.find();
    res.status(200).json(allComplaint);
  } catch (error) {
    res.status(500).json({ error });
  }
});

//Post complaint
router.post("/", async (req, res, next) => {
  const {
    name,
    role,
    email,
    telephone,
    category,
    sector,
    involved,
    witness,
    talkedAbout,
    details,
    previousComplaint,
    agreement,
  } = req.body;
  const { body } = req;

  try {
    if (!agreement || !category || !sector) {
      return res.status(400).json({
        msg: "Category, Sector and accept the LGPD agreement is required.",
      });
    }
    const newComplaint = await Complaint.create({ ...body });
    res.status(201).json(newComplaint);
    console.log("Complaint created successfully");
  } catch (error) {
    res.status(400).json({ msg: "Couldn't create complaint!" });
  }
});

export default router;
