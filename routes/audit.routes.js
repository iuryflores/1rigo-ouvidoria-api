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
});
//ASSUMIR DENUNCIA
router.post(`/admin/denuncia/:id`, async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { body } = req;

  try {
    const foundedDenuncia = await Complaint.findById(id).populate("audits");
    if (!foundedDenuncia) {
      return res.status(400).json({ msg: "Denuncia não encontrada!" });
    }

    const foundedUser = await User.findById(userId);
    if (!foundedUser) return res.status(404).json({ msg: "User not found" });

    const newAudit = await Audit.create({
      entidade: "denúncia",
      descricao: "Assumiu a denúncia",
      operacao: "ASSUMIR",
      complaint_id: id,
      userName: foundedUser.full_name
    });

    await Complaint.findByIdAndUpdate(id, {
      $set: {
        responsible_name: foundedUser.full_name,
        responsible_id: userId,
        status: "em-andamento"
      },
      $push: { audits: newAudit._id }
    });
  } catch (error) {
    console.error(error.message);
  }
});
//FINALIZAR DENUNCIA
router.patch(`/admin/denuncia/:id`, async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  const tipo = req.body.tipo
    .toLowerCase()
    .replace("finalizar", "finalizada")
    .replace(" ", "-");
  const newTipo = tipo.replace(" ", "-");
  console.log(newTipo);

  try {
    const foundedDenuncia = await Complaint.findOne({ _id: id }).populate(
      "audits"
    );
    if (!foundedDenuncia) {
      return res.status(400).json({ msg: "Denuncia não encontrada!" });
    }
    const foundedUser = await User.findById(userId);
    if (!foundedUser) return res.status(404).json({ msg: "User not found" });

    const newAudit = await Audit.create({
      entidade: "denúncia",
      descricao: "Finalizou a denúncia",
      operacao: "FINALIZAR",
      complaint_id: id,
      userName: foundedUser.full_name
    });

    await Complaint.findByIdAndUpdate(
      { _id: id },
      {
        $set: { status: newTipo },
        $push: { audits: newAudit._id }
      }
    );
    return res.status(200).json({ msg: "Finalizada com suscesso!" });
  } catch (error) {
    console.error(error.message);
  }
});
export default router;
