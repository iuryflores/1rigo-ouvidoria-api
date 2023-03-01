import { Router } from "express";
import Complaint from "../models/Complaint.model.js";
import Audit from "../models/Audit.model.js";
import User from "../models/User.model.js";
import Message from "../models/Message.model.js";
import * as dotenv from "dotenv";
dotenv.config();
const router = Router();

router.get(
  "/track-complaint/:protocolo_id/:pass_protocolo",
  async (req, res, next) => {
    const { protocolo_id } = req.params;
    console.log(protocolo_id);
  }
);

router.patch("/admin/denuncia/:id", async (req, res, next) => {
  const { messageUser } = req.body;
  const { id } = req.params;
  const userId = req.user.id;
  console.log(id, userId);

  try {
    const foundedDenuncia = await Complaint.findOne({ _id: id }).populate(
      "audits"
    );
    if (!foundedDenuncia) {
      return res.status(400).json({ msg: "Denuncia não encontrada!" });
    }
    const foundedUser = await User.findById(userId);
    if (!foundedUser) return res.status(404).json({ msg: "User not found" });

    const newMessage = await Message.create({
      descricao: messageUser,
      userName: foundedUser.full_name,
      complaint_id: id
    });

    if (!newMessage) {
      return res.status(401).json({ msg: "Error sending message" });
    }
    console.log(newMessage);

    const newAudit = await Audit.create({
      entidade: "mensagens",
      descricao: "Enviou uma mensagem",
      operacao: "ENVIAR",
      complaint_id: id,
      userName: foundedUser.full_name
    });
    await Complaint.findByIdAndUpdate(
      { _id: id },
      {
        $set: { etapa: "usuario" },
        $push: { messages_id: newMessage._id, audits: newAudit._id }
      }
    );
    return res.status(200).json({ msg: "Message sended!" });
  } catch (error) {
    console.log(error);
  }
});
export default router;
