import { Router } from "express";
import Complaint from "../models/Complaint.model.js";
import Audit from "../models/Audit.model.js";
import User from "../models/User.model.js";
import * as dotenv from "dotenv";
dotenv.config();
const router = Router();

//PEGAR AUDITORIAS DA DENUNCIA
router.get(`/admin/denuncia/:id`, async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { body } = req;

  try {
    const foundedDenuncia = await Complaint.findById(id).populate("audits");
    if (!foundedDenuncia)
      return res.status(404).json({ msg: "Denuncia não encontrada!" });

    const foundedAudit = await Audit.find({ complaint_id: id });
    if (!foundedAudit)
      return res.status(404).json({ msg: "Auditoria não encontrada" });

   
  } catch (error) {
    console.error(error.message);
  }
  console.log(foundedDenuncia);
});
//ASSUMIR DENUNCIA
router.post(`/admin/denuncia/:id`, async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { body } = req;
  console.log(body, userId, id);
  try {
    const foundedDenuncia = await Complaint.findById(id).populate("audits");
    if (!foundedDenuncia) {
      return res.status(400).json({ msg: "Denuncia não encontrada!" });
    }
    console.log(foundedDenuncia);

    const foundedUser = await User.findById(userId);
    if (!foundedUser) return res.status(404).json({ msg: "User not found" });

    const newAudit = await Audit.create({
      entidade: "denúncia",
      descricao: "Assumiu a denúncia",
      operacao: "ASSUMIU",
      complaint_id: id,
      userName: foundedUser.full_name,
    });

    await Complaint.findByIdAndUpdate(id, {
      $set: { responsible_name: foundedUser.full_name, responsible_id: userId },
      $push: { audits: newAudit._id },
    });

    console.log(newAudit);
  } catch (error) {
    console.error(error.message);
  }
});
export default router;
