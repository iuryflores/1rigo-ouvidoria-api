import { Router } from "express";
import ProtocoloID from "../models/ProtocoloID.model.js";
import Complaint from "../models/Complaint.model.js";
import Message from "../models/Message.model.js";
import Audit from "../models/Audit.model.js";

const router = Router();

router.get(
  "/track-complaint/:protocolo_id/:pass_protocolo",
  async (req, res, next) => {
    const { protocolo_id, pass_protocolo } = req.params;

    try {
      const dataProtocolo = await ProtocoloID.find({
        protocolo_id: protocolo_id,
        protocolo_pass: pass_protocolo
      })
        .populate({ path: "complaint_ID" })
        .populate({ path: "complaint_ID", populate: { path: "messages_id" } });

      return res.status(200).json(dataProtocolo);
    } catch (error) {
      return res.status(400).json({ msg: "Erro ao pegar dados" });
    }
  }
);
router.post(
  "/track-complaint/:protocolo_id/:pass_protocolo",
  async (req, res, next) => {
    const { protocolo_id, pass_protocolo } = req.params;
    try {
      const founded = await ProtocoloID.findOne({
        protocolo_id: protocolo_id,
        protocolo_pass: pass_protocolo
      });
      if (!founded) {
        return res.status(400).json({ msg: "Protocolo e senha inválidos!" });
      }
      return res.status(200).json(founded);
    } catch (error) {
      return res.status(400).json({ msg: "Error ao checar Protocolo" });
    }
  }
);
router.patch(
  "/track-complaint/:protocolo_id/:pass_protocolo",
  async (req, res, next) => {
    const { messageUser } = req.body;
    const { protocolo_id } = req.params;



    try {
      const foundedDenuncia = await Complaint.findOne({
        protocolo_id: protocolo_id
      }).populate("audits");
      if (!foundedDenuncia) {
        return res.status(400).json({ msg: "Denuncia não encontrada!" });
      }

      const newMessage = await Message.create({
        descricao: messageUser,
        userName: foundedDenuncia.name || "Anônimo",
        complaint_id: foundedDenuncia._id
      });

      if (!newMessage) {
        return res.status(401).json({ msg: "Error sending message" });
      }
      console.log(newMessage);

      const newAudit = await Audit.create({
        entidade: "mensagens",
        descricao: "Enviou uma mensagem",
        operacao: "ENVIAR",
        complaint_id: foundedDenuncia._id,
        userName: foundedDenuncia.name || "Anônimo"
      });
      await Complaint.findByIdAndUpdate(
        { _id: foundedDenuncia._id },
        {
          $set: { etapa: "ouvidoria" },
          $push: { messages_id: newMessage._id, audits: newAudit._id }
        }
      );
      return res.status(200).json({ msg: "Message sended!" });
    } catch (error) {
      console.log(error);
    }
  }
);
export default router;
