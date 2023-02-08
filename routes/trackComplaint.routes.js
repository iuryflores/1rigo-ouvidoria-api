import { Router } from "express";
import ProtocoloID from "../models/ProtocoloID.model.js";
import Complaint from "../models/Complaint.model.js";

const router = Router();

router.get(
  "/track-complaint/:protocolo_id/:pass_protocolo/",
  async (req, res, next) => {
    console.log("entrou na api");
    const { protocolo_id, pass_protocolo } = req.params;

    try {
      const dataProtocolo = await ProtocoloID.find(protocolo_id);

      console.log(dataProtocolo);
      return dataProtocolo;
    } catch (error) {
      return res.status(400).json({ msg: "Erro ao pegar dados" });
    }
  }
);

export default router;
