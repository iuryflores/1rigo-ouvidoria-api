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
router.post("/add-complaint/:category", async (req, res, next) => {
  const { category } = req.params;
  const {
    name,
    role,
    email,
    telephone,
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
        msg: "É obrigatório selecionar um departamento, e aceitar o termo de ciência acima!",
      });
    }
   if(sector === 'Selecione um departamento'){
    return res.status(400).json({msg:'É necessário selecionar um departamento'})
   }
    const newComplaint = await Complaint.create({ ...body });
    return res.status(201).json(newComplaint);
    console.log("Complaint created successfully");
  } catch (error) {
    return res.status(400).json({ msg: "Couldn't create complaint!" });
  }
});

export default router;
